const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const UserModel = require("../models/user");

const USER_FIELDS = "firstName lastName about skills age gender photoUrl";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_FIELDS);

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

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId toUserId", USER_FIELDS);

    const data = connections.map((connection) => {
      // Ensure both IDs are strings for comparison
      if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({
      message: "Connections retrieved successfully",
      data,
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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {

    const loggedInUser = req.user;
    const page = Math.max(Number.parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Number.parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // Find all connection requests involving the logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    });


    // Build a set of all user IDs involved in those requests (excluding self)
    const hideUserFromFeed = new Set();
    const selfId = loggedInUser._id.toString();
    connectionRequests.forEach((request) => {
      const fromId = request.fromUserId.toString();
      const toId = request.toUserId.toString();
      if (fromId !== selfId) hideUserFromFeed.add(fromId);
      if (toId !== selfId) hideUserFromFeed.add(toId);
    });

    // Exclude those users from the feed, and also exclude self (all as strings)
    const users = await UserModel.find({
      _id: {
        $nin: [
          ...Array.from(hideUserFromFeed),
          selfId,
        ],
      },
    })
      .select(USER_FIELDS)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "User feed retrieved successfully",
      data: users,
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
