const mongoose = require('mongoose');

module.exports = (mongoUrl = 'mongodb://localhost/grailed') => {
  return mongoose.connect(mongoUrl);
};
