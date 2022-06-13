const express = require("express");
const data = require("./data");

const app = express();

const port = process.env.PORT || 8000;

/** milliseconds in day */
const MS_IN_DAY = 24 * 60 * 60 * 1000;

app.get("/picture", async (req, res, next) => {
  try {
    const now = Date.now();
    const lastPicTime = await data.getPictureTime();
    if (now >= lastPicTime + MS_IN_DAY) {
      await data.setPicture("https://picsum.photos/1200");
    }
    const pic = await data.getPicture();
    res.type("jpg");
    res.send(pic);
  } catch (e) {
    next(e);
  }
});

app.use(express.static("./site"));

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log("Server started in port " + port);
});
