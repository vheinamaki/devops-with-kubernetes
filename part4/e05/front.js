const axios = require("axios").default;
const express = require("express");

const app = express();

const port = process.env.PORT || 8000;

app.use(express.static("./site"));

app.use(express.json());

const apiUrl = "http://todoproject-back-svc";

// Simply use backend's health check since it's the only dependency
app.get("/healthz", async (req, res) => {
  const healthz = await axios.get(apiUrl + "/healthz");
  res.sendStatus(healthz.status);
});

app.get("/picture", async (req, res, next) => {
  try {
    const backendRes = await axios.get(apiUrl + "/picture", {
      responseType: "arraybuffer",
    });
    res.type("jpg");
    res.send(backendRes.data);
  } catch (e) {
    next(e);
  }
});

app.get("/todos", async (req, res, next) => {
  try {
    const backendRes = await axios.get(apiUrl + "/todos");
    res.send(backendRes.data);
  } catch (e) {
    next(e);
  }
});

app.post("/todos", async (req, res, next) => {
  try {
    const backendRes = await axios.post(apiUrl + "/todos", req.body);
    res.send(backendRes.data);
  } catch (e) {
    next(e);
  }
});

app.put("/todos/:id([0-9]+)", async (req, res, next) => {
  try {
    const backendRes = await axios.put(
      apiUrl + "/todos/" + Number(req.params.id),
      req.body
    );
    res.send(backendRes.data);
  } catch (e) {
    next(e);
  }
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(400);
});

app.listen(port, () => {
  console.log("Frontend started on port " + port);
});
