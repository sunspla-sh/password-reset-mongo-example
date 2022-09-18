const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const BCRYPTJS_SALT = process.env.BCRYPTJS_SALT;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')){
    return next();
  }

  const hash = await bcryptjs.hash(this.password, +BCRYPTJS_SALT)

  this.password = hash;

  next();

});

module.exports = mongoose.model('User', userSchema);
