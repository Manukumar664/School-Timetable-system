const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
      default: "123456",
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },

    className: { type: String },
    section: { type: String, default: null },

    assignedClass: [
      {
        className: { type: String },
        section: { type: String },
        time: { type: String },
        subject: { type: String },
        assignedAt: { type: Date, default: Date.now },
      },
    ],

    subjects: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
