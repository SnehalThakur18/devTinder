const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("This is the admin data");
});

app.delete("/admin/deleteData", (req, res) => {
  res.send("Data deleted successfully.");
});

app.get("/user/getUserData", userAuth, (req, res) => {
  res.send("This is the user data");
});

app.post("/user/login", (req, res) => {
  throw new Error("test");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong.");
  }
});

app.listen(7777, () => {
  console.log("server is running on port 7777");
});
