const router = require('express').Router();
const {
  signUp,
  confirmEmail,
  signIn,
} = require('../controllers/auth.controller');

router.post('/signup', signUp);
router.post('/confirmemail', confirmEmail);
router.post('/signup', signIn);

module.exports = router;
