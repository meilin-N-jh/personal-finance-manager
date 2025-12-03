const express = require('express');
const { query } = require('../database/connection');
const { validate, categorySchema } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all categories for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    let whereClause = 'WHERE user_id = $1';
    const params = [userId];

    if (type) {
      whereClause += ' AND type = $2';
      params.push(type);
    }

    const result = await query(
      `SELECT * FROM categories ${whereClause} ORDER BY name ASC`,
      params
    );

    res.json({
      categories: result.rows
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to retrieve categories'
    });
  }
});

// Get a single category by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryId = req.params.id;

    const result = await query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [categoryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Category not found'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      error: 'Failed to retrieve category'
    });
  }
});

// Create a new category
router.post('/', authenticateToken, validate(categorySchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, color = '#000000', icon } = req.body;

    // Check if category with same name and type already exists
    const existingResult = await query(
      'SELECT id FROM categories WHERE user_id = $1 AND name = $2 AND type = $3',
      [userId, name, type]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        error: 'Category with this name already exists'
      });
    }

    const result = await query(
      `INSERT INTO categories (user_id, name, type, color, icon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, name, type, color, icon || null]
    );

    res.status(201).json({
      message: 'Category created successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      error: 'Failed to create category'
    });
  }
});

// Update a category
router.put('/:id', authenticateToken, validate(categorySchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryId = req.params.id;
    const { name, type, color, icon } = req.body;

    // Check if category exists and belongs to user
    const existingResult = await query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [categoryId, userId]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Category not found'
      });
    }

    // Check if another category with same name and type already exists
    const duplicateResult = await query(
      'SELECT id FROM categories WHERE user_id = $1 AND name = $2 AND type = $3 AND id != $4',
      [userId, name, type, categoryId]
    );

    if (duplicateResult.rows.length > 0) {
      return res.status(400).json({
        error: 'Category with this name already exists'
      });
    }

    const result = await query(
      `UPDATE categories
       SET name = $1, type = $2, color = $3, icon = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [name, type, color, icon || null, categoryId, userId]
    );

    res.json({
      message: 'Category updated successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      error: 'Failed to update category'
    });
  }
});

// Delete a category
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryId = req.params.id;

    // Check if category exists and belongs to user
    const existingResult = await query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [categoryId, userId]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Category not found'
      });
    }

    // Check if category has transactions
    const transactionResult = await query(
      'SELECT COUNT(*) as count FROM transactions WHERE category_id = $1',
      [categoryId]
    );

    if (parseInt(transactionResult.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with existing transactions'
      });
    }

    // Delete the category
    await query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2',
      [categoryId, userId]
    );

    res.json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      error: 'Failed to delete category'
    });
  }
});

module.exports = router;