const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) console.log(err);
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword =  function (enteredPassWord, userPassword, callback) {
  bcrypt.compare(enteredPassWord, userPassword, (err,isMatch) => {
    if(err) console.log(err);
    callback(null,isMatch);
  });
}


