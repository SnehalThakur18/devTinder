const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const { validateSignupData } = require("../utils/validations");

authRouter.post("/signup", async (req, res) => {
  try {
    const validationResult = validateSignupData(req);
    if (!validationResult.isValid) {
      return res.status(400).json({ message: validationResult.message });
    }

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).send("Invalid login credentials.");
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
      res.send("Login successful.");
    } else {
      return res.status(400).send("Invalid login credentials.");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = authRouter;
