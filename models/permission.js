const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  chat: {
    type: {
      C: Boolean,
      D: Boolean,
      R: Boolean,
      U: Boolean
    }
  },
  news: {
    type: {
      C: Boolean,
      D: Boolean,
      R: Boolean,
      U: Boolean
    }
  },
  setting: {
    type: {
      C: Boolean,
      D: Boolean,
      R: Boolean,
      U: Boolean
    }
  }
});

module.exports = mongoose.model("Permission", PermissionSchema);