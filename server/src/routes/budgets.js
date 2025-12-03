const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All budget routes require authentication
router.use(authenticateToken);

// Get user budgets
router.get('/', (req, res) => {
  res.json({
    message: 'Budgets endpoint - to be implemented',
    user: req.user
  });
});

module.exports = router;