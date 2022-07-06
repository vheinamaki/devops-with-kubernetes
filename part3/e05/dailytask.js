const axios = require("axios").default;

const svcName = "todoproject-back-svc";

const main = async () => {
  const res = await axios.get("https://en.wikipedia.org/wiki/Special:Random");
  const articleLink = res.request.res.responseUrl;
  await axios.post(`http://${svcName}/todos`, { text: `Read ${articleLink}` });
  console.log("Posted new todo: " + articleLink);
};

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
})();
