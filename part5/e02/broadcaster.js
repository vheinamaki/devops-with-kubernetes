const { log } = require("./utils");
const nats = require("nats");
const axios = require("axios").default;

const natsUrl = process.env.NATS_URL;
const slackChannel = process.env.CHANNEL_ID;
const authToken = process.env.AUTH_TOKEN;

/**
 * @type {nats.NatsConnection}
 */
let natsConn = null;

const sc = nats.StringCodec();

const main = async () => {
  try {
    natsConn = await nats.connect({
      servers: natsUrl,
    });
    const sub = natsConn.subscribe("todo.event", {
      queue: "todo.broadcasters",
    });
    log("Listening to NATS messages");
    // const s = sub.getSubject();
    for await (const m of sub) {
      if (m.data) {
        const decoded = sc.decode(m.data);
        log(`Got a message: ${decoded}`);
        postEvent(decoded);
      }
    }
    await natsConn.closed();
  } catch (e) {
    log(`NATS Connection failed: ${e}`);
  }
};
main();

const postEvent = async (msg) => {
  try {
    const result = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: slackChannel,
        text: msg,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    log(`Post response: ${JSON.stringify(result.data)}`);
  } catch (e) {
    log(`Error posting event: ${e}`);
  }
};
