const otpGenerator = require('otp-generator');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: [true, 'Email is already been used'],
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [5, 'Password must be at least 5 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['manager', 'employee'],
    default: 'manager',
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be more than 20 characters'],
  },
  shift: {
    type: String,
    enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'friday', 'saturday'],
    default: 'monday',
  },
  confirmEmailToken: String,
  conifrmEmailExpire: Date,
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.getConfirmEmailToken = async function () {
  const confirmEmailToken = otpGenerator.generate(6, {
    alphabets: false,
    upperCase: true,
    specialChars: false,
  });

  this.confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmEmailToken)
    .digest()
    .toString('hex');
  this.confirmEmailExpire = new Date(Date.now() + 10 * 60 * 1000);

  return confirmEmailToken;
};

UserSchema.methods.getJwtToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY);
};

module.exports = mongoose.model('User', UserSchema);
