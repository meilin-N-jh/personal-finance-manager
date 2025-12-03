const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = router;