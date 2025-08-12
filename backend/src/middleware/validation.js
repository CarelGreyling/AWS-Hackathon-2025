// Validation middleware for API requests

const Joi = require('joi');

// Reserved names that cannot be used for alerts
const RESERVED_NAMES = ['default', 'system', 'admin', 'root', 'null', 'undefined'];

// Alert name validation schema
const alertNameSchema = Joi.string()
  .min(3)
  .max(255)
  .pattern(/^[a-zA-Z0-9][a-zA-Z0-9\-_\s]*$/)
  .required()
  .custom((value, helpers) => {
    // Check if name is reserved
    if (RESERVED_NAMES.includes(value.toLowerCase())) {
      return helpers.error('any.reserved');
    }
    return value;
  })
  .messages({
    'string.min': 'Alert name must be at least 3 characters long',
    'string.max': 'Alert name cannot exceed 255 characters',
    'string.pattern.base': 'Alert name contains invalid characters. Use only letters, numbers, hyphens, underscores, and spaces',
    'any.reserved': 'This name is reserved. Please choose a different name',
    'any.required': 'Alert name is required'
  });

// Impact analysis request validation schema
const impactAnalysisSchema = Joi.object({
  alertName: alertNameSchema,
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required',
    'string.empty': 'User ID cannot be empty'
  }),
  accountId: Joi.string().required().messages({
    'any.required': 'Account ID is required',
    'string.empty': 'Account ID cannot be empty'
  }),
  timestamp: Joi.string().isoDate().required().messages({
    'any.required': 'Timestamp is required',
    'string.isoDate': 'Timestamp must be a valid ISO date'
  })
});

// Validation middleware factory
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: details
        },
        timestamp: new Date().toISOString()
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Specific validation middleware for impact analysis
const validateImpactAnalysis = validateRequest(impactAnalysisSchema);

module.exports = {
  validateImpactAnalysis,
  validateRequest,
  alertNameSchema,
  impactAnalysisSchema,
  RESERVED_NAMES
};
