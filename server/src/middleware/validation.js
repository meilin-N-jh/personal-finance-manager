const Joi = require('joi');

// Generic validation middleware
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Input validation failed',
        details: errors
      });
    }

    req[property] = value;
    next();
  };
};

// User registration validation schema
const userRegistrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional()
});

// User login validation schema
const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Transaction validation schema
const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().max(255).optional(),
  category_id: Joi.number().integer().positive().required(),
  account_id: Joi.number().integer().positive().required(),
  type: Joi.string().valid('income', 'expense').required(),
  date: Joi.date().iso().optional()
});

// Account validation schema
const accountSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid('checking', 'savings', 'credit_card', 'cash', 'investment').required(),
  balance: Joi.number().default(0),
  currency: Joi.string().length(3).default('USD')
});

// Category validation schema
const categorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid('income', 'expense').required(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#000000'),
  icon: Joi.string().max(50).optional()
});

// Budget validation schema
const budgetSchema = Joi.object({
  categoryId: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().required(),
  period: Joi.string().valid('monthly', 'yearly').required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
});

// Transaction query parameters validation
const transactionQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  categoryId: Joi.number().integer().positive().optional(),
  accountId: Joi.number().integer().positive().optional(),
  type: Joi.string().valid('income', 'expense').optional()
});

module.exports = {
  validate,
  userRegistrationSchema,
  userLoginSchema,
  transactionSchema,
  accountSchema,
  categorySchema,
  budgetSchema,
  transactionQuerySchema
};