const { Client } = require("pg");
const { writeFile, readFile } = require("fs/promises");
const axios = require("axios").default;
const { Buffer } = require("buffer");
const { log } = require("./utils");
const { setTimeout } = require("timers/promises");

/**
 * @type {Client}
 */
let client = null;

const storageDir = "./files/";

(async () => {
  let isReady = false;
  while (!isReady) {
    try {
      await initDb();
      isReady = true;
    } catch (e) {
      log(`Error while attempting DB connection: ${e}`);
    }
    await setTimeout(2000);
  }
})();

const initDb = async () => {
  client = new Client({
    user: "postgres",
    host: "postgres-service",
    database: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
  });
  await client.connect();

  await client.query(`CREATE TABLE IF NOT EXISTS sites (
        id          SERIAL,

        pictureTime BIGINT
                    NOT NULL
    );`);
  // Check if site exists already
  const siteResult = await client.query("SELECT * FROM sites WHERE id=1");
  if (siteResult.rows.length === 0) {
    await client.query("INSERT INTO sites (id, pictureTime) VALUES (1, 0)");
  }

  await client.query(`CREATE TABLE IF NOT EXISTS todos (
        id      SERIAL,

        "text"  VARCHAR(256)
                NOT NULL,

        iscompleted BOOLEAN
                    NOT NULL
    );`);
  // Check if todo items exist already
  const todoResult = await client.query("SELECT * FROM todos");
  if (todoResult.rows.length === 0) {
    await client.query(
      "INSERT INTO todos (\"text\", iscompleted) VALUES ('todo 1', FALSE), ('todo 2', FALSE)"
    );
  }
};

const data = {
  /**
   * @returns {Promise<number>}
   */
  getPictureTime: async () => {
    const result = await client.query("SELECT * FROM sites WHERE id=1");
    return result.rows[0].picturetime;
  },

  getPicture: async () => {
    return await readFile(storageDir + "picture.jpg");
  },

  setPicture: async (url) => {
    const pictureTime = Math.round(Date.now() / 1000);
    const res = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const buf = Buffer.from(res.data);
    await writeFile(storageDir + "picture.jpg", buf);
    await client.query("UPDATE sites SET pictureTime=$1 WHERE id=1", [
      pictureTime,
    ]);
  },

  getTodos: async () => {
    const result = await client.query("SELECT * FROM todos");
    return result.rows.map((r) => ({
      id: r.id,
      text: r.text,
      isCompleted: r.iscompleted,
    }));
  },

  addTodo: async (text) => {
    const res = await client.query(
      'INSERT INTO todos ("text", iscompleted) VALUES ($1, FALSE) RETURNING *',
      [text]
    );
    const result = res.rows[0];
    return {
      id: result.id,
      text: result.text,
      isCompleted: result.iscompleted,
    };
  },

  updateTodo: async (id, text, isCompleted) => {
    const res = await client.query(
      "UPDATE todos SET text = $2, iscompleted = $3 WHERE id=$1 RETURNING *",
      [id, text, isCompleted]
    );
    const result = res.rows[0];
    return {
      id: result.id,
      text: result.text,
      isCompleted: result.iscompleted,
    };
  },

  hasConnectivity: async () => {
    try {
      await client.query("SELECT NOW() as now");
      return true;
    } catch (e) {
      log(`DB connectivity check failed: ${e}`);
      return false;
    }
  },
};

module.exports = data;
