const express = require("express");
const { readFile } = require("fs/promises");

const app = express();

const port = process.env.PORT || 3000;

const router = express.Router();

router.get("/", async (req, res) => {
  let data = "";
  try {
    const file = await readFile("./files/timestamp");
    data = file.toString();
  } catch (e) {
    console.error(e);
  }
  res.send(data);
});

app.use("/", router);

app.listen(port, () => {
  console.log("Logreader started in port " + port);
});
