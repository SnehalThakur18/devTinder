const express = require("express");
const authRouter = express.Router();
const UserModel = require("../models/user");
const { validateSignupData } = require("../utils/validations");

authRouter.post("/signup", async (req, res) => {
  try {
    const validationResult = validateSignupData(req);
    if (!validationResult.isValid) {
      return res.status(400).json({ message: validationResult.message });
    }

    const { firstName, lastName, email, password } = req.body;

    const user = new UserModel({
      firstName,
      lastName,
      email,
      password,
    });
    user.password = await user.encryptPassword(password);
    await user.save();
    res.status(201).json({
      message: "User created successfully.",
      status: "success",
      statusCode: 201,
    });
  } catch (err) {
    res.status(400).json({
      message: "ERROR: " + err.message,
      status: "error",
      statusCode: 400,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        status: "error",
        statusCode: 400,
      });
    }
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid login credentials.",
        status: "error",
        statusCode: 400,
      });
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // JWT with 7-day expiry (token expiresOn ~ cookie expiry)
      const token = await user.getJWT();

      res.cookie("token", token, {
        httpOnly: true,
        // expires in 7 days from now
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res.json({
        message: "Login successful.",
        status: "success",
        statusCode: 200,
      });
    } else {
      return res.status(400).json({
        message: "Invalid login credentials.",
        status: "error",
        statusCode: 400,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "ERROR: " + err.message,
      status: "error",
      statusCode: 400,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.json({
    message: "User logged out successfully.",
    status: "success",
    statusCode: 200,
  });
});

module.exports = authRouter;
