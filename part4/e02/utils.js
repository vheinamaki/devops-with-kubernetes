const log = (str) => {
  console.log(`[${new Date().toUTCString()}] ${str}`);
};

module.exports = { log };
