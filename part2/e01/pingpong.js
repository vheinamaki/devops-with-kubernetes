const express = require("express");
const { writeFile } = require("fs/promises");

const app = express();

const port = process.env.PORT || 3000;

const router = express.Router();

let count = 0;

router.get("/pingpong", async (req, res) => {
  const pongs = count++;
  try {
    await writeFile("./files/pongs", "" + pongs);
  } catch (e) {
    console.error(e);
  }
  res.send(`pong ${pongs}`);
});

app.use("/", router);

app.listen(port, () => {
  console.log("Pinpong started in port " + port);
});
