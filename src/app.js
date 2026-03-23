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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
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
    const user = new UserModel(userObj);
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "ValidationError",
        message: err.message,
      });
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
