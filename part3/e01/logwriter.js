const { randomUUID } = require("crypto");
const { writeFileSync } = require("fs");

const randomStr = randomUUID();

setInterval(() => {
  const state = `${new Date().toISOString()}:${randomStr}`;
  console.log(state);
  try {
    writeFileSync("./files/timestamp", state);
  } catch (e) {
    console.error(e);
  }
}, 5000);
