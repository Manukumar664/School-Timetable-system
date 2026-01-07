const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
 isAssigned: { type: Boolean, default: false }
  
});

module.exports = mongoose.model("Class", classSchema);
