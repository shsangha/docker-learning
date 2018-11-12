const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
      message: 'Enter a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: function(v) {
        return  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8})$/.test(v);
      },
      message: 'Password requires 1 number, 1 uppercase character and 8 characters',
    },
  },
});

UserSchema.pre('save', function (next) {
  let user = this;
   if (!user.isModified('password')) return next;

   bcrypt.hash(user.password,10, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
   });
});

module.exports = mongoose.model('User', UserSchema);
