const router = require('express').Router();

const {
  signupController,
  requestResetPasswordController,
  resetPasswordController
} = require('../controllers/auth.controller')

router.post('/signup', signupController);

router.post('/request-reset-password', requestResetPasswordController);

router.post('/reset-password', resetPasswordController);

module.exports = router;