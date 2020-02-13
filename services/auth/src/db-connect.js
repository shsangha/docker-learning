const mongoose = require('mongoose');

module.exports = (mongoUrl = 'mongodb://auth-db/auth', options) => mongoose.connect(mongoUrl, options);
