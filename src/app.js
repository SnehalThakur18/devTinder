const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.use(express.json());

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

app.post("/signup", async (req, res) => {
  try {
    const userObj = req.body;
    const nameRegex = /^[A-Za-z\s]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (userObj.firstName && !nameRegex.test(userObj.firstName)) {
      return res.status(400).json({ message: "Invalid first name." });
    }

    if (userObj.lastName && !nameRegex.test(userObj.lastName)) {
      return res.status(400).json({ message: "Invalid last name." });
    }

    if (userObj.password && !passwordRegex.test(userObj.password)) {
      return res.status(400).json({
        message: "Password must include letters, numbers, and a special character.",
      });
    }

    const user = new UserModel(userObj);
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({
        message: messages.join(" "),
      });
    }

    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ message: "Email already exists." });
    }

    res.status(500).json({
      error: "InternalServerError",
      message: "Error while creating user.",
    });
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
