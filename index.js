import { fetchToday } from "./src/controllers/api.js";
import { processThreads } from "./src/controllers/threads.js";
import { connect } from "./src/utils/db.js";

import { addThreads, getUnpublished } from "./src/utils/queries.js";

const db = connect();

async function init() {
  fetchToday()
    .then((threads) => addThreads(db)(threads))
    .then(() => getUnpublished(db))
    .then((posts) => processThreads(posts, db))
    .then((processList) => {
      Promise.all(processList);
    });
}

init();

//# 1. Avatar ile gitmiyor, 2. avatar ile gidiyor.
//https://img.ekstat.com/profiles/frodonunparmagi-638014884870823835.jpg
//https://img.ekstat.com/profiles/kemirgenjoe-637975514808723498.jpg
