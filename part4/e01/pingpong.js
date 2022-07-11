const express = require("express");
const { Client } = require("pg");
const { setTimeout } = require("timers/promises");

const app = express();

const port = process.env.PORT || 3000;

const router = express.Router();

const pgPass = process.env.POSTGRES_PASSWORD;

let isDbReady = false;

/**
 * @type {Client}
 */
let client = null;

router.get("/", async (req, res) => {
  res.send("Health check endpoint for pingpong");
});

router.get("/healthz", async (req, res) => {
  res.sendStatus(isDbReady ? 200 : 500);
});

router.get("/pingpong", async (req, res) => {
  let pongs = -1;
  try {
    const res = await client.query("SELECT * FROM pongs WHERE id=1");
    pongs = res.rows[0].num + 1;
    await client.query("UPDATE pongs SET num=$1 WHERE id=1", [pongs]);
  } catch (e) {
    console.error(e);
  }
  res.send(`pong ${pongs}`);
});

app.use("/", router);

app.listen(port, () => {
  console.log("Pinpong started in port " + port);
});

const connectDb = async () => {
  client = new Client({
    user: "postgres",
    host: "postgres-service",
    database: "postgres",
    password: pgPass,
    port: 5432,
  });
  await client.connect();
  console.log("Database connection ready");
  isDbReady = true;

  await client.query(`CREATE TABLE IF NOT EXISTS pongs (
        id  SERIAL,

        num INTEGER
            NOT NULL
    );
`);
  await client.query("INSERT INTO pongs (id, num) VALUES (1, 0);");
};

(async () => {
  while (!isDbReady) {
    try {
      await connectDb();
    } catch (e) {
      console.error(`DB Error: ${e}`);
    }
    await setTimeout(2000);
  }
})();
