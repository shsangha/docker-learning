const { createError } = require('apollo-errors');

const ValidationError = createError('ValidationError', {
  message: 'Validation Error'
});

module.exports = ValidationError;
