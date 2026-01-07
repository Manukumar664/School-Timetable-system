const mongoose=require('mongoose')
const timetableSchema = new mongoose.Schema({
  day: { type: String, required: true },
  slot1: {
    subject: String,
    time: String,
  },
  slot2: {
    subject: String,
    time: String,
  },
  slot3: {
    subject: String,
    time: String,
  },
  classRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
});
module.exports = mongoose.model("Timetable", timetableSchema);
