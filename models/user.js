const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String
  },
  middleName: {
    type: String
  },
  surName: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
});

User.methods.validPassword = async function(password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
}

module.exports = mongoose.model("User", User);