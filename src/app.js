const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Akshay",
    lastName: "Saini",
    email: "akshay@saini.com",
    password: "Test@123",
  };
  //creating a new instance of the user model
  const user = new UserModel(userObj);
  //Svaing the user to the database
  await user.save();

  try {
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error while creating user: ", err.message);
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
