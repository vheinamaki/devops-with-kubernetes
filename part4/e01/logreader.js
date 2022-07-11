const axios = require("axios").default;
const express = require("express");
const { readFile } = require("fs/promises");

const app = express();

const port = process.env.PORT || 3000;

const router = express.Router();

const pingpongHost = "pingpong-service";

let isReady = false;

router.get("/", async (req, res) => {
  let data = "";
  let pongs = 0;
  try {
    const file = await readFile("./files/timestamp");
    data = file.toString();
  } catch (e) {
    console.error(e);
  }
  try {
    const res = await axios.get(`http://${pingpongHost}/pingpong`);
    // parse number from `pong x` message
    pongs = parseInt(res.data.split(" ")[1]);
  } catch (e) {
    console.error(e);
  }
  const envMessage = process.env.MESSAGE;
  const msg = `${envMessage}\n${data}\nPing / Pongs: ${pongs}`;
  res.send(msg);
});

router.get("/healthz", async (req, res) => {
  const pingpongRes = await axios.get(`http://${pingpongHost}/healthz`);
  res.sendStatus(isReady ? pingpongRes.status : 500);
});

app.use("/", router);

app.listen(port, () => {
  console.log("Logreader started in port " + port);
  isReady = true;
});
