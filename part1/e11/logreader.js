const express = require("express");
const { readFile } = require("fs/promises");

const app = express();

const port = process.env.PORT || 3000;

const router = express.Router();

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
    const file = await readFile("./files/pongs");
    pongs = parseInt(file.toString());
  } catch (e) {
    console.error(e);
  }
  const msg = `${data}\nPing / Pongs: ${pongs}`;
  res.send(msg);
});

app.use("/", router);

app.listen(port, () => {
  console.log("Logreader started in port " + port);
});
