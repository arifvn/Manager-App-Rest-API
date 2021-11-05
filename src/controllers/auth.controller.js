const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const ErrorResponse = require('../utils/ErrorResponse');

const signUp = asyncHandler(async (req, res, next) => {
  const { email, name, password, role } = req.body;

  const user = await User.create({ email, name, password, role });
  console.log(user);
  const token = user.getConfirmEmailToken();
  console.log(token);

  await user.save({ validateBeforeSave: false });

  const response = {
    success: true,
    token,
    data: `Email verification has been sent to ${email}`,
  };

  if (process.env.NODE_ENV === 'production') {
    delete response.token;

    const options = {
      to: user.email,
      subject: 'Manager-App Email Verification',
      text: `This is your email verification code for your Manager-App account ${token}`,
    };
    await sendEmail(options);
  }

  return res.status(201).json(response);
});

const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(
      new ErrorResponse(`Please add token received from your email`, 400)
    );
  }

  const confirmEmailToken = crypto
    .createHash('sha256')
    .update(token)
    .digest()
    .toString('hex');

  const user = await User.findOne({
    confirmEmailToken,
    confirmEmailExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse(`Token is invalid`, 400));
  }

  user.confirmEmailToken = undefined;
  user.confirmEmailExpire = undefined;
  user.isEmailConfirmed = true;
  await user.save({ validateBeforeSave: false });

  const jwt = await user.getJwtToken();

  return res.status(200).json({ success: true, data: jwt });
});

const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 404));
  }

  if (!user.isEmailConfirmed) {
    return next(new ErrorResponse(`Please verify your email address`, 400));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 400));
  }

  const jwt = await user.getJwtToken();

  return res.status(200).json({ success: true, data: jwt });
});

module.exports = {
  signUp,
  confirmEmail,
  signIn,
};
