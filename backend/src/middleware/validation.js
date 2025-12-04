const Joi = require('joi');

// Task validation schema
const taskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must not exceed 255 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().allow('', null).optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high, urgent'
  }),
  status: Joi.string().valid('todo', 'in_progress', 'done').optional().messages({
    'any.only': 'Status must be one of: todo, in_progress, done'
  }),
  dueDate: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Due date must be a valid ISO date'
  })
});

// Task update schema (all fields optional except at least one must be present)
const taskUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional().messages({
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title must not exceed 255 characters'
  }),
  description: Joi.string().allow('', null).optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high, urgent'
  }),
  status: Joi.string().valid('todo', 'in_progress', 'done').optional().messages({
    'any.only': 'Status must be one of: todo, in_progress, done'
  }),
  dueDate: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Due date must be a valid ISO date'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const filterSchema = Joi.object({
  status: Joi.string().valid('todo', 'in_progress', 'done').optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  dueDate: Joi.date().iso().optional(),
  search: Joi.string().optional()
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.body = value;
    next();
  };
};

// Query validation middleware
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors
      });
    }

    req.query = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  taskSchema,
  taskUpdateSchema,
  filterSchema
};
