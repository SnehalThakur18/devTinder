const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Please enter a valid email address.",
      },
    },
    password: {
      type: String,
      required: true,
      maxLength: 15,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate: {
        validator: (value) => {
          if (!value) return true; // allow empty / undefined
          const allowed = ["male", "female", "others"];
          return allowed.includes(value);
        },
        message: "Gender must be one of: male, female, others.",
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "These is default about section. Please update it later.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
