const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteDev:HOg4yolSIfk3bKG5@cluster0.jcfpc77.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
