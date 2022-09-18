const {
  signup,
  requestResetPassword,
  resetPassword
} = require('../services/auth.service');

const signupController = async (req, res, next) => {

  const signupService = await signup(req.body);

  return res.json(signupService);

};

const requestResetPasswordController = async (req, res, next) => {

  const { email } = req.body;

  const requestResetPasswordService = await requestResetPassword(email);

  return res.json(requestResetPasswordService);

}

const resetPasswordController = async (req, res, next) => {

  const { userId, token, password } = req.body;

  const resetPasswordService = await resetPassword(userId, token, password);

  return res.json(resetPasswordService);

};


module.exports = {
  signupController,
  requestResetPasswordController,
  resetPasswordController
};