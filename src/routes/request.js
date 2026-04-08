const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      //check if userid is valid
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request Already Exists!!",
          status: "error",
          statusCode: 400,
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
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

  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
          status: "error",
          statusCode: 400,
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId, // request Id is the connection request document id which is newly create when a user sends connection request to other user.
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).json({
          message: "Connection request not found or cannot be reviewd.",
          status: "error",
          statusCode: 400,
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request " + status,
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
  },
);

module.exports = requestRouter;
