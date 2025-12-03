const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { validate, budgetSchema } = require('../middleware/validation');

const router = express.Router();

// All budget routes require authentication
router.use(authenticateToken);

// Get user budgets
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT b.*, c.name as category_name, c.color as category_color,
       COALESCE(
         (SELECT SUM(t.amount)
          FROM transactions t
          WHERE t.user_id = $1 AND t.type = 'expense'
          AND t.category_id = b.category_id
          AND t.date BETWEEN b.start_date AND COALESCE(b.end_date, CURRENT_DATE)),
         0
       ) as spent
       FROM budgets b
       LEFT JOIN categories c ON b.category_id = c.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
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

    // Get total budgeted amount
    const budgetResult = await query(
      'SELECT COALESCE(SUM(amount), 0) as total_budgeted FROM budgets WHERE user_id = $1',
      [userId]
    );

    // Get total spent from transactions for budgeted categories
    const spentResult = await query(
      `SELECT COALESCE(SUM(t.amount), 0) as total_spent
       FROM transactions t
       INNER JOIN budgets b ON t.category_id = b.category_id
       WHERE t.user_id = $1 AND t.type = 'expense'`,
      [userId]
    );

    const totalBudgeted = parseFloat(budgetResult.rows[0].total_budgeted) || 0;
    const totalSpent = parseFloat(spentResult.rows[0].total_spent) || 0;
    const totalRemaining = totalBudgeted - totalSpent;

    res.json({
      totalBudgeted,
      totalSpent,
      totalRemaining
    });
  } catch (error) {
    console.error('Get budget summary error:', error);
    res.status(500).json({
      error: 'Failed to retrieve budget summary'
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