const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");

cron.schedule("0 8 * * *", async () => {
  //send emails to all people who have got requests the previous day.
  try {
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequestsOfYesterday = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmailsToSend = [
      ...new Set(pendingRequestsOfYesterday.map((req) => req.toUserId.email)),
    ];

    for (const email of listOfEmailsToSend) {
      //send emails
      console.log("Email sent to " + email);
    }
  } catch (err) {
    console.error(err);
  }
});
