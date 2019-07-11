const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
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
  image: {
    type: String
  },
  access_token: {
    type: String,
    required: true,
    unique: true
  },
  permissionId: {
    type: String,
    required: true
  },
});

UserSchema.methods.validPassword = async function(password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
}

module.exports = mongoose.model("User", UserSchema);