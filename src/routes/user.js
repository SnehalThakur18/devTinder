const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
      // }).populate("fromUserId", "firstName lastName about skills age gender");
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "about",
      "skills",
      "age",
      "gender",
    ]);
    res.json({
      message: "Received connection requests retrieved successfully",
      data: connectionRequests,
      status: "success",
      statusCode: 200,
    });
  } catch (err) {
    res.status(400).json({
      message: "ERROR: " + err.message,
      status: "error",
      statusCode: 400,
    });
  }
});

module.exports = userRouter;
