const { createError } = require('apollo-errors');

const ValidationError = createError('FooError', {
  message: 'Validation Error'
});

module.exports = ValidationError;
