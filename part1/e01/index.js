const { randomUUID } = require("crypto");

const randomStr = randomUUID();

setInterval(() => {
  console.log(new Date().toISOString() + ":", randomStr);
}, 5000);
