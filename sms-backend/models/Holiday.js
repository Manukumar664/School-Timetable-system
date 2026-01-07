// models/Holiday.js
const mongoose = require("mongoose");
const holidaySchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  appliesTo: { 
    type: String, 
    enum: ["student", "teacher", "all"], 
    default: ["all" ]
  },
});
module.exports = mongoose.model("Holiday", holidaySchema);
