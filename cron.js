import cron from "node-cron";
// const shell = require("shelljs");

//npm install node-cron@3.0.0
// npm install shelljs@0.8.4

import { fetchToday } from "./src/controllers/api.js";
import { processThreads } from "./src/controllers/threads.js";
import { connect } from "./src/utils/db.js";

import { addThreads, getUnpublished } from "./src/utils/queries.js";

const db = connect();

console.log("Cron Started on", new Date().toGMTString());

async function init() {
  fetchToday()
    .then((threads) => addThreads(db)(threads))
    .then(() => getUnpublished(db))
    .then((posts) => processThreads(posts, db))
    .then((processList) => {
      console.log("Thread list retrieved, reading & posting.");
      Promise.all(processList);
    });
}

cron.schedule("*/2 * * * *", function () {
  console.log("Executing task.");
  // init();
});
