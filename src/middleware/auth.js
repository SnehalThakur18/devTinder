const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Please Login!",
        status: "error",
        statusCode: 401,
      });
    }
    const secret = process.env.JWT_SECRET;
    const decodedObj = jwt.verify(token, secret);
    const userId = decodedObj._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({
      message: "ERROR: " + err.message,
      status: "error",
      statusCode: 400,
    });
  }
};

module.exports = { userAuth };
