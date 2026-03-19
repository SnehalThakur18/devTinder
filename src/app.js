const express = require("express");

const app = express();

app.use("/test",(req, res) => {
  res.send("Hello from the server");
});

app.use("/namaste",(req,res)=>{
    res.send("Namaste from the server");
})

app.listen(7777, () => {
  console.log("server is running on port 7777");
});
