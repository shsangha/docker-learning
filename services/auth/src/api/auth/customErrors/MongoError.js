const { createError } = require('apollo-errors');

const ValidationError = createError('MongoError', {
  message: 'Mongo Error'
});

module.exports = ValidationError;
