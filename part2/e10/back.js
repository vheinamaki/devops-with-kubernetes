const express = require("express");
const data = require("./data");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 8001;

/** seconds in day */
const S_IN_DAY = 24 * 60 * 60;

app.use(cors());

app.use(express.json());

const log = (str) => {
  console.log(`[${new Date().toUTCString()}] ${str}`);
};

app.use((req, res, next) => {
  log(`${req.method} ${req.url}`);
  next();
});

app.get("/picture", async (req, res, next) => {
  try {
    const now = Date.now() / 1000;
    const lastPicTime = await data.getPictureTime();
    if (now >= lastPicTime + S_IN_DAY) {
      log("Fetching new daily picture...");
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
    const todos = await data.getTodos();
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
      const todo = await data.addTodo(req.body.text);
      res.send(todo);
      log(`Todo accepted: ${JSON.stringify(req.body)}`);
    } else {
      log(`Todo rejected: ${JSON.stringify(req.body)}`);
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
  log("Backend started on port " + port);
});
