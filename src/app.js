const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("./utils/validations");

const app = express();

app.use(express.json());

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

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await UserModel.find({ email: userEmail });
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    console.error("Error while fetching user:", err);
    res
      .status(400)
      .send("Something went wrong. Please try again later." + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (err) {
    console.error("Error while fetching user:", err);
    res
      .status(400)
      .send("Something went wrong. Please try again later." + err.message);
  }
});

app.get("/findUserByID", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await UserModel.findById(userId);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    console.error("Error while fetching user:", err);
    res
      .status(400)
      .send("Something went wrong. Please try again later." + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (deletedUser) {
      res.send("User deleted successfully.");
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    console.error("Error while deleting user:", err);
    res
      .status(400)
      .send("Something went wrong. Please try again later." + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["gender", "about", "skills", "photoUrl"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );
    if (!isUpdateAllowed) {
      return res.status(400).json({
        message:
          "Only these fields can be updated: " + ALLOWED_UPDATES.join(", "),
      });
    }

    if (data.skills && data.skills.length > 10) {
      return res.status(400).json({
        message: "You can add up to 10 skills only.",
      });
    }
    const updateUser = await UserModel.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
    console.log(updateUser);
    if (updateUser) {
      res.send("User updated successfully.");
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    console.error("Error while updating user:", err);
    res
      .status(400)
      .send("Something went wrong. Please try again later." + err.message);
  }
});

app.patch("/userWithEmail", async (req, res) => {
  const userEmail = req.body.email;
  const data = req.body;
  try {
    const updateUser = await UserModel.findOneAndUpdate(
      { email: userEmail },
      data,
      {
        returnDocument: "after",
      },
    );
    console.log(updateUser);
    if (updateUser) {
      res.send("User updated successfully.");
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    console.error("Error while updating user:", err);
    res
      .status(400)
      .send("Something went wrong. Please try again later." + err.message);
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
