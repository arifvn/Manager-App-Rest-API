const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');

const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  return res.status(200).json({ success: true, data: users });
});

module.exports = {
  getUsers,
};
