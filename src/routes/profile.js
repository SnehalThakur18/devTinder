const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validations");
const validator = require("validator");

const USER_FIELDS = "firstName lastName about skills age gender";

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user.toObject();
    const allowedFields = USER_FIELDS.split(" ");
    const filteredUser = {};
    allowedFields.forEach((field) => {
      if (user[field] !== undefined) filteredUser[field] = user[field];
    });
    res.json({
      message: "Profile retrived successfully",
      data: filteredUser,
      status: "success",
      statusCode: 200,
    });
  } catch (err) {
    res.status(400).json({
      message: "ERROR: " + err.message,
      status: "error",
      statusCode: 400,
    });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).json({
        message: "Invalid fields in request body.",
        status: "error",
        statusCode: 400,
      });
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: "Profile updated successfully",
      data: loggedInUser,
      status: "success",
      statusCode: 200,
    });
  } catch (err) {
    res.status(400).json({
      message: "ERROR: " + err.message,
      status: "error",
      statusCode: 400,
    });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "currentPassword and newPassword are required.",
        status: "error",
        statusCode: 400,
      });
    }

    const isCurrentPasswordValid =
      await req.user.validatePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect.",
        status: "error",
        statusCode: 400,
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from the current password.",
        status: "error",
        statusCode: 400,
      });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: "New password is not strong enough.",
        status: "error",
        statusCode: 400,
      });
    }

    req.user.password = await req.user.encryptPassword(newPassword);
    await req.user.save();
    res.json({
      message: "Password updated successfully",
      status: "success",
      statusCode: 200,
    });
  } catch (err) {
    res.status(400).json({
      message: "ERROR: " + err.message,
      status: "error",
      statusCode: 400,
    });
  }
});

module.exports = profileRouter;
