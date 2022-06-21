const express = require("express");
const data = require("./data");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 8001;

/** milliseconds in day */
const MS_IN_DAY = 24 * 60 * 60 * 1000;

let id = 3;

const todos = [
  { id: 1, text: "TODO 1" },
  { id: 2, text: "TODO 2" },
];

app.use(cors());

app.use(express.json());

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

app.get("/todos", async (req, res, next) => {
  try {
    res.send(todos);
  } catch (e) {
    next(e);
  }
});

app.post("/todos", async (req, res, next) => {
  try {
    if (
      req.body.text &&
      req.body.text.length > 0 &&
      req.body.text.length <= 140
    ) {
      todos.push({ id: id++, text: req.body.text });
      res.send(todos[todos.length - 1]);
    } else {
      res.sendStatus(400);
    }
  } catch (e) {
    next(e);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log("Backend started on port " + port);
});
