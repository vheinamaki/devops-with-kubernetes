const { randomUUID } = require("crypto");
const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

const router = express.Router();

let state = "";

router.get("/", (req, res) => {
  res.send(state);
});

app.use("/", router);

app.listen(port, () => {
  console.log("Logoutput started in port " + port);
});

const randomStr = randomUUID();

setInterval(() => {
  state = `${new Date().toISOString()}:${randomStr}`;
  console.log(state);
}, 5000);
