const Razorpay = require("razorpay");


let instance;
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret || keyId === "RAZORPAY_KEY_ID" || keySecret === "RAZORPAY_KEY_SECRET") {
  // Dummy/mock instance for development without real keys
  instance = {
    orders: {
      create: async (orderData) => {
        // Return a mock order object
        return {
          id: "order_dummy_id",
          status: "created",
          amount: orderData.amount,
          currency: orderData.currency,
          receipt: orderData.receipt,
          notes: orderData.notes,
        };
      },
    },
  };
  console.warn("[Razorpay] Using dummy Razorpay instance. Payments are not processed.");
} else {
  instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

module.exports = instance;
