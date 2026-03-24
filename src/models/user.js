const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      maxLength: 15,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough. " + value);
        }
      },
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
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid URL for photo: " + value);
        }
      },
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
