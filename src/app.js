const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({
    name: "John Doe",
    city: "New York",
  });
});

app.post("/user", (req, res) => {
  console.log("save data to database");
  res.send("Data saved successfully");
});

app.delete("/user", (req, res) => {
  res.send("User deleted successfully");
});

app.put("/user", (req, res) => {
  res.send("User updated successfully");
});

app.patch("/user", (req, res) => {
  res.send("User partially updated successfully");
});

app.listen(7777, () => {
  console.log("server is running on port 7777");
});
