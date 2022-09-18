const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Token = require('../models/Token.model');
const sendEmail = require('../utils/emails/sendEmail');
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;
const BCRYPTJS_SALT = +process.env.BCRYPTJS_SALT;
const CLIENT_URL = process.env.CLIENT_URL;

const signup = async data => {
  
  let user = await User.findOne({ email: data.email });

  if(user){
    throw new Error('Email already exists');
  }

  user = new User(data);

  const authToken = jwt.sign({ id: user._id }, JWT_SECRET);

  await user.save();

  return {
    userId: user._id,
    email: user.email,
    name: user.name,
    authToken: authToken
  };

};

const requestResetPassword= async email => {
  
  const user = await User.findOne({ email });

  if(!user) throw new Error('User does not exist');

  let token = await Token.findOne({ userId: user._id });

  if(token) await token.delete();

  let resetToken = crypto.randomBytes(32).toString('hex');

  const hash = await bcryptjs.hash(resetToken, BCRYPTJS_SALT);

  await new Token({
    userId: user._id,
    token: hash,
  }).save();

  const link = `${CLIENT_URL}/password-reset?token=${resetToken}&id=${user._id}`;

  await sendEmail(user.email, 'Password Reset Request', { name: user.name, link }, './templates/request-reset-password.hbs');

  return link;

};

const resetPassword = async (userId, token, password) => {

  const passwordResetToken = await Token.findOne({ userId });

  if(!passwordResetToken){
    throw new Error('Invalid or expired password reset token');
  }

  const isValid = await bcryptjs.compare(token, passwordResetToken.token);

  if(!isValid){
    throw new Error('Invalid or expired password reset token');
  }

  const hash = await bcryptjs.hash(password, BCRYPTJS_SALT);

  const user = await User.findByIdAndUpdate(userId, { password: hash }, { new: true });

  await sendEmail(user.email, 'Password Reset Successfully', { name: user.name }, './templates/reset-password.hbs');

  await passwordResetToken.delete();

  return true;

};


module.exports = {
  signup,
  requestResetPassword,
  resetPassword
}