const express = require('express');
const { query } = require('../database/connection');
const { validate, accountSchema } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all accounts for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      accounts: result.rows
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({
      error: 'Failed to retrieve accounts'
    });
  }
});

// Get a single account by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const accountId = req.params.id;

    const result = await query(
      'SELECT * FROM accounts WHERE id = $1 AND user_id = $2',
      [accountId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Account not found'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({
      error: 'Failed to retrieve account'
    });
  }
});

// Create a new account
router.post('/', authenticateToken, validate(accountSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, balance = 0, currency = 'CNY' } = req.body;

    const result = await query(
      `INSERT INTO accounts (user_id, name, type, balance, currency)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, name, type, balance, currency]
    );

    res.status(201).json({
      message: 'Account created successfully',
      account: result.rows[0]
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({
      error: 'Failed to create account'
    });
  }
});

// Update an account
router.put('/:id', authenticateToken, validate(accountSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const accountId = req.params.id;
    const { name, type, balance, currency } = req.body;

    // Check if account exists and belongs to user
    const existingResult = await query(
      'SELECT id FROM accounts WHERE id = $1 AND user_id = $2',
      [accountId, userId]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Account not found'
      });
    }

    const result = await query(
      `UPDATE accounts
       SET name = $1, type = $2, balance = $3, currency = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [name, type, balance, currency, accountId, userId]
    );

    res.json({
      message: 'Account updated successfully',
      account: result.rows[0]
    });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({
      error: 'Failed to update account'
    });
  }
});

// Delete an account
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const accountId = req.params.id;

    // Check if account exists and belongs to user
    const existingResult = await query(
      'SELECT id FROM accounts WHERE id = $1 AND user_id = $2',
      [accountId, userId]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Account not found'
      });
    }

    // Check if account has transactions
    const transactionResult = await query(
      'SELECT COUNT(*) as count FROM transactions WHERE account_id = $1',
      [accountId]
    );

    if (parseInt(transactionResult.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'Cannot delete account with existing transactions'
      });
    }

    // Delete the account
    await query(
      'DELETE FROM accounts WHERE id = $1 AND user_id = $2',
      [accountId, userId]
    );

    res.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Failed to delete account'
    });
  }
});

module.exports = router;