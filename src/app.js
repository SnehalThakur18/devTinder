const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Middleware 1");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 2");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 3");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 4");
    res.send("Response 4");
  },
);

app.listen(7777, () => {
  console.log("server is running on port 7777");
});
