const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const { userAuth } = require("./middleware/auth");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("./utils/validations");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).send("Invalid login credentials.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // JWT with 7-day expiry (token expiresOn ~ cookie expiry)
      const token = jwt.sign({ _id: user._id }, "testdata@123", {
        expiresIn: "7d",
      });

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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed: ", err);
  });
