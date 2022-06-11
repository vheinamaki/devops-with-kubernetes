const express = require("express");

const app = express();

const port = process.env.PORT || 8000;

app.use(express.static("./site"));

app.listen(port, () => {
  console.log("Server started in port " + port);
});
