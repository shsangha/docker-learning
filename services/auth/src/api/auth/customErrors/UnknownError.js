const { createError } = require('apollo-errors');

const ValidationError = createError('UnknownError', {
  message: 'Unknown Error'
});

module.exports = ValidationError;
