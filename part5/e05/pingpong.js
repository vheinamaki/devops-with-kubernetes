const express = require("express");
const { Client } = require("pg");

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
  try {
    await connectDb();
    const result = await client.query("SELECT * FROM pongs WHERE id=1");
    const pongs = result.rows[0].num + 1;
    await client.query("UPDATE pongs SET num=$1 WHERE id=1", [pongs]);
    res.send(`pong ${pongs}`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/", router);

app.listen(port, () => {
  console.log("Pinpong started in port " + port);
});

const connectDb = async () => {
  if (isDbReady) {
    return;
  }

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
  // Check if record already exists in DB
  const pongResults = await client.query("SELECT * FROM pongs WHERE id=1;");
  if (pongResults.rows.length === 0) {
    await client.query("INSERT INTO pongs (id, num) VALUES (1, 0);");
  }
};
