const express = reqire("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");

paymentRouter.post("/payment/create", async (req, res) => {
  console.log("Payment creation endpoint hit");
  try {
    const order = await razorpayInstance.orders.create({
      amount: 70000, // amount in the smallest currency unit (e.g., paise for INR)
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: "value1",
        lastName: "value2",
        membershipType: "silver",
      },
    });
    res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = paymentRouter;
