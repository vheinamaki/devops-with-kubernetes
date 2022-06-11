const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

const router = express.Router();

let count = 0;

router.get("/pingpong", (req, res) => {
  res.send(`pong ${count++}`);
});

app.use("/", router);

app.listen(port, () => {
  console.log("Pinpong started in port " + port);
});
