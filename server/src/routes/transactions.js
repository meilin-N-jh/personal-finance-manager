const express = require('express');
const { query } = require('../database/connection');
const { validate, transactionSchema } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all transactions for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0, category_id, account_id, type } = req.query;

    let whereClause = 'WHERE t.user_id = $1';
    const params = [userId];
    let paramCount = 1;

    if (category_id) {
      paramCount++;
      whereClause += ` AND t.category_id = $${paramCount}`;
      params.push(category_id);
    }

    if (account_id) {
      paramCount++;
      whereClause += ` AND t.account_id = $${paramCount}`;
      params.push(account_id);
    }

    if (type) {
      paramCount++;
      whereClause += ` AND t.type = $${paramCount}`;
      params.push(type);
    }

    const result = await query(
      `SELECT t.*, c.name as category_name, a.name as account_name
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       LEFT JOIN accounts a ON t.account_id = a.id
       ${whereClause}
       ORDER BY t.date DESC, t.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM transactions t
       ${whereClause}`,
      params
    );

    res.json({
      transactions: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Failed to retrieve transactions'
    });
  }
});

// Get a single transaction by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    const result = await query(
      `SELECT t.*, c.name as category_name, a.name as account_name
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       LEFT JOIN accounts a ON t.account_id = a.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Transaction not found'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      error: 'Failed to retrieve transaction'
    });
  }
});

// Create a new transaction
router.post('/', authenticateToken, validate(transactionSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      amount,
      description,
      category_id,
      account_id,
      type,
      date
    } = req.body;

    // Verify that the category and account belong to the user
    const categoryResult = await query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [category_id, userId]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid category'
      });
    }

    const accountResult = await query(
      'SELECT id FROM accounts WHERE id = $1 AND user_id = $2',
      [account_id, userId]
    );

    if (accountResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid account'
      });
    }

    // Create the transaction
    const result = await query(
      `INSERT INTO transactions (user_id, amount, description, category_id, account_id, type, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, amount, description, category_id, account_id, type, date || new Date().toISOString().split('T')[0]]
    );

    const transaction = result.rows[0];

    // Update account balance
    const balanceChange = type === 'income' ? amount : -amount;
    await query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
      [balanceChange, account_id, userId]
    );

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      error: 'Failed to create transaction'
    });
  }
});

// Update a transaction
router.put('/:id', authenticateToken, validate(transactionSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;
    const {
      amount,
      description,
      category_id,
      account_id,
      type,
      date
    } = req.body;

    // Get the original transaction
    const originalResult = await query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [transactionId, userId]
    );

    if (originalResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Transaction not found'
      });
    }

    const originalTransaction = originalResult.rows[0];

    // Verify that the category and account belong to the user
    const categoryResult = await query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [category_id, userId]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid category'
      });
    }

    const accountResult = await query(
      'SELECT id FROM accounts WHERE id = $1 AND user_id = $2',
      [account_id, userId]
    );

    if (accountResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid account'
      });
    }

    // Revert the original balance change
    const originalBalanceChange = originalTransaction.type === 'income' ? originalTransaction.amount : -originalTransaction.amount;
    await query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3',
      [originalBalanceChange, originalTransaction.account_id, userId]
    );

    // Update the transaction
    const updateResult = await query(
      `UPDATE transactions
       SET amount = $1, description = $2, category_id = $3, account_id = $4, type = $5, date = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [amount, description, category_id, account_id, type, date || new Date().toISOString().split('T')[0], transactionId, userId]
    );

    // Apply the new balance change
    const newBalanceChange = type === 'income' ? amount : -amount;
    await query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
      [newBalanceChange, account_id, userId]
    );

    res.json({
      message: 'Transaction updated successfully',
      transaction: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      error: 'Failed to update transaction'
    });
  }
});

// Delete a transaction
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    // Get the transaction before deleting
    const result = await query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Transaction not found'
      });
    }

    const transaction = result.rows[0];

    // Revert the balance change
    const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
    await query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
      [balanceChange, transaction.account_id, userId]
    );

    // Delete the transaction
    await query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [transactionId, userId]
    );

    res.json({
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      error: 'Failed to delete transaction'
    });
  }
});

// Get transaction statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'month' } = req.query;

    let dateFilter;
    switch (period) {
      case 'week':
        dateFilter = "date >= date('now', '-7 days')";
        break;
      case 'month':
        dateFilter = "date >= date('now', '-1 month')";
        break;
      case 'year':
        dateFilter = "date >= date('now', '-1 year')";
        break;
      default:
        dateFilter = "1=1";
    }

    const result = await query(
      `SELECT
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
         COUNT(*) as transaction_count
       FROM transactions
       WHERE user_id = $1 AND ${dateFilter}`,
      [userId]
    );

    const stats = result.rows[0];

    res.json({
      total_income: parseFloat(stats.total_income) || 0,
      total_expenses: parseFloat(stats.total_expenses) || 0,
      net_income: (parseFloat(stats.total_income) || 0) - (parseFloat(stats.total_expenses) || 0),
      transaction_count: parseInt(stats.transaction_count) || 0,
      period
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve transaction statistics'
    });
  }
});

module.exports = router;