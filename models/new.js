const mongoose = require('mongoose');

const NewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  theme: {
    type: String
  },
  date: {
    type: String
  }
});

module.exports = mongoose.model("New", NewSchema);