const express = require("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { userAuth } = require("../middleware/auth");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
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
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.status(200).json({ ...savedPayment.toJSON() });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = paymentRouter;
