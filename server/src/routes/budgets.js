const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { validate, budgetSchema } = require('../middleware/validation');

const router = express.Router();

// Helper function to get the last day of a month
function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate(); // month is 1-based, Date constructor uses 0-based
}

// All budget routes require authentication
router.use(authenticateToken);

// Get user budgets
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month, period } = req.query;

    let whereClause = 'WHERE b.user_id = $1';
    let queryParams = [userId];
    let paramIndex = 2;

    // If year and month are specified, filter by budgets that are active during that month
    if (year && month) {
      const lastDay = getLastDayOfMonth(parseInt(year), parseInt(month));
      const monthStart = `${year}-${month.padStart(2, '0')}-01`;
      const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
      // Budget must be active during the selected month:
      // Budget starts before or during the month AND budget ends after or during the month
      whereClause += ` AND b.start_date <= $${paramIndex + 1} AND (b.end_date >= $${paramIndex} OR b.end_date IS NULL)`;
      queryParams.push(monthStart, monthEnd);
      paramIndex += 2;
    }

    // If period is specified, filter by period
    if (period) {
      whereClause += ` AND b.period = $${paramIndex}`;
      queryParams.push(period);
      paramIndex++;
    }

    const result = await query(
      `SELECT b.*, c.name as category_name, c.color as category_color,
       COALESCE(
         (SELECT SUM(t.amount)
          FROM transactions t
          WHERE t.user_id = $1 AND t.type = 'expense'
          AND t.category_id = b.category_id
          AND t.date BETWEEN b.start_date AND COALESCE(b.end_date, CURRENT_DATE)),
         0
       ) as spent,
       CASE
         WHEN CURRENT_DATE > b.end_date THEN 'expired'
         WHEN CURRENT_DATE < b.start_date THEN 'future'
         ELSE 'active'
       END as status
       FROM budgets b
       LEFT JOIN categories c ON b.category_id = c.id
       ${whereClause}
       ORDER BY b.start_date DESC, b.created_at DESC`,
      queryParams
    );

    res.json({
      data: result.rows
    });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({
      error: 'Failed to retrieve budgets'
    });
  }
});

// Create new budget
router.post('/', validate(budgetSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { category_id, amount, period, start_date, end_date } = req.body;

    // Verify category belongs to user
    const categoryResult = await query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [category_id, userId]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid category'
      });
    }

    const result = await query(
      `INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, category_id, amount, period, start_date, end_date]
    );

    res.status(201).json({
      message: 'Budget created successfully',
      budget: result.rows[0]
    });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({
      error: 'Failed to create budget'
    });
  }
});

// Update budget
router.put('/:id', validate(budgetSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;
    const { category_id, amount, period, start_date, end_date } = req.body;

    // Verify budget belongs to user
    const budgetResult = await query(
      'SELECT id FROM budgets WHERE id = $1 AND user_id = $2',
      [budgetId, userId]
    );

    if (budgetResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Budget not found'
      });
    }

    // Verify category belongs to user
    const categoryResult = await query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [category_id, userId]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid category'
      });
    }

    const result = await query(
      `UPDATE budgets
       SET category_id = $1, amount = $2, period = $3, start_date = $4, end_date = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [category_id, amount, period, start_date, end_date, budgetId, userId]
    );

    res.json({
      message: 'Budget updated successfully',
      budget: result.rows[0]
    });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({
      error: 'Failed to update budget'
    });
  }
});

// Get budget summary with actual spending
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month, period } = req.query;

    let budgetWhereClause = 'WHERE b.user_id = $1';
    let spentWhereClause = 'WHERE t.user_id = $1 AND t.type = \'expense\'';
    let queryParams = [userId];
    let paramIndex = 2;

    // If year and month are specified, filter by that month
    if (year && month) {
      const lastDay = getLastDayOfMonth(parseInt(year), parseInt(month));
      const monthStart = `${year}-${month.padStart(2, '0')}-01`;
      const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
      // Filter budgets that are active during the selected month
      budgetWhereClause += ` AND b.start_date <= $${paramIndex + 1} AND (b.end_date >= $${paramIndex} OR b.end_date IS NULL)`;
      // Filter transactions within the selected month
      spentWhereClause += ` AND t.date >= $${paramIndex + 2} AND t.date <= $${paramIndex + 3}`;
      queryParams.push(monthStart, monthEnd, monthStart, monthEnd);
      paramIndex += 4;
    }

    // If period is specified, filter by period
    if (period) {
      budgetWhereClause += ` AND b.period = $${paramIndex}`;
      queryParams.push(period);
      paramIndex++;
    }

    // Get total budgeted amount
    const budgetResult = await query(
      `SELECT COALESCE(SUM(amount), 0) as total_budgeted FROM budgets b ${budgetWhereClause}`,
      queryParams
    );

    // Create separate params for spent query - fix the SQL structure
    const spentQueryParams = [userId];
    let spentParamIndex = 2;
    let spentFilterWhereClause = "";

    if (year && month) {
      const lastDay = getLastDayOfMonth(parseInt(year), parseInt(month));
      const monthStart = `${year}-${month.padStart(2, '0')}-01`;
      const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
      spentFilterWhereClause += ` AND t.date >= $${spentParamIndex} AND t.date <= $${spentParamIndex + 1}`;
      spentQueryParams.push(monthStart, monthEnd);
      spentParamIndex += 2;
    } else if (period) {
      switch (period) {
        case 'week':
          spentFilterWhereClause += " AND t.date >= CURRENT_DATE - INTERVAL '7 days'";
          break;
        case 'month':
          spentFilterWhereClause += " AND t.date >= CURRENT_DATE - INTERVAL '1 month'";
          break;
        case 'year':
          spentFilterWhereClause += " AND t.date >= CURRENT_DATE - INTERVAL '1 year'";
          break;
      }
    }

    // Get total spent from transactions for budgeted categories within specified period
    const spentResult = await query(
      `SELECT COALESCE(SUM(t.amount), 0) as total_spent
       FROM transactions t
       INNER JOIN budgets b ON t.category_id = b.category_id AND b.user_id = t.user_id
       WHERE t.user_id = $1 AND t.type = 'expense'
       AND t.date BETWEEN b.start_date AND COALESCE(b.end_date, CURRENT_DATE)
       ${spentFilterWhereClause}`,
      spentQueryParams
    );

    const totalBudgeted = parseFloat(budgetResult.rows[0].total_budgeted) || 0;
    const totalSpent = parseFloat(spentResult.rows[0].total_spent) || 0;
    const totalRemaining = totalBudgeted - totalSpent;

    res.json({
      totalBudgeted,
      totalSpent,
      totalRemaining,
      period: year && month ? `${year}-${month}` : 'all'
    });
  } catch (error) {
    console.error('Get budget summary error:', error);
    res.status(500).json({
      error: 'Failed to retrieve budget summary'
    });
  }
});

// Get available periods for budget filtering
router.get('/periods', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get distinct months and years from budgets
    const budgetPeriodsResult = await query(
      `SELECT DISTINCT
       EXTRACT(YEAR FROM start_date) as year,
       EXTRACT(MONTH FROM start_date) as month,
       COUNT(*) as budget_count
       FROM budgets
       WHERE user_id = $1
       GROUP BY EXTRACT(YEAR FROM start_date), EXTRACT(MONTH FROM start_date)
       ORDER BY year DESC, month DESC`,
      [userId]
    );

    // Get distinct months and years from transactions
    const transactionPeriodsResult = await query(
      `SELECT DISTINCT
       EXTRACT(YEAR FROM date) as year,
       EXTRACT(MONTH FROM date) as month,
       COUNT(*) as transaction_count
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'
       GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
       ORDER BY year DESC, month DESC`,
      [userId]
    );

    res.json({
      budgetPeriods: budgetPeriodsResult.rows,
      transactionPeriods: transactionPeriodsResult.rows
    });
  } catch (error) {
    console.error('Get periods error:', error);
    res.status(500).json({
      error: 'Failed to retrieve periods'
    });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;

    // Verify budget belongs to user
    const result = await query(
      'DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id',
      [budgetId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Budget not found'
      });
    }

    res.json({
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({
      error: 'Failed to delete budget'
    });
  }
});

module.exports = router;