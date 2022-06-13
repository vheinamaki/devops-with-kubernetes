const sqlite3 = require("sqlite3");
const existsSync = require("fs").existsSync;
const { writeFile, readFile } = require("fs/promises");
const axios = require("axios").default;
const { Buffer } = require("buffer");

const storageDir = "./files/";
const dbFile = storageDir + "storage.db";

const dbExists = existsSync(dbFile);
const db = new sqlite3.Database(dbFile);
if (!dbExists) {
  db.exec(`CREATE TABLE IF NOT EXISTS sites (
        id  INTEGER
            PRIMARY KEY
            AUTOINCREMENT
            NOT NULL,

        pictureTime INTEGER
                    NOT NULL
    );

    INSERT INTO sites (id, pictureTime) VALUES (1, 0);
    `);
}

const run = (query, params) => {
  return new Promise((res, rej) => {
    db.run(query, params, function (err) {
      const result = this;
      if (err) rej(err);
      else res(result);
    });
  });
};

const all = (query, params) => {
  return new Promise((res, rej) => {
    db.all(query, params, (err, rows) => {
      if (err) rej(err);
      else res(rows);
    });
  });
};

const get = (query, params) => {
  return new Promise((res, rej) => {
    db.get(query, params, (err, row) => {
      if (err) rej(err);
      else res(row);
    });
  });
};

const data = {
  /**
   * @returns {Promise<number>}
   */
  getPictureTime: async () => {
    const result = await get("SELECT * FROM sites WHERE id=1");
    return result.pictureTime;
  },
  getPicture: async () => {
    return await readFile(storageDir + "picture.jpg");
  },
  setPicture: async (url) => {
    const pictureTime = Date.now();
    const res = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const buf = Buffer.from(res.data);
    await writeFile(storageDir + "picture.jpg", buf);
    await run("UPDATE sites SET pictureTime=$arg WHERE id=1", {
      $arg: pictureTime,
    });
  },
};

module.exports = data;
