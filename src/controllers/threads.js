import { config } from "../../config.js";
import { updatePublishStatus } from "../utils/queries.js";
import { wait } from "../utils/utils.js";
import { fetchThread, postThread } from "./api.js";

//threads => db records.
export function processThreads(threads, db) {
  const postMax = config.maxPostCount;
  const sendingCount = threads.length > postMax ? postMax : threads.length;

  if (threads.length == 0) {
    console.log("No new posts.");
  } else {
    console.log(
      `${threads.length} new posts, sending ${sendingCount} of them.`
    );
  }

  //Limit sending count.
  threads = threads.slice(0, postMax);

  const tasks = threads.map((t) => {
    return new Promise(async (resolve) => {
      console.log("Posting Thread: ", t.threadId, t.title);

      //# Fetch Thread
      const thread = await fetchThread(t.threadPath);

      //# Wait
      await wait(250);

      //Test Mode
      if (config.testMode) {
        //
        console.log("Post Data", thread);
        //> Return Test / Post Data
        resolve(thread);
        //
      } else {
        //
        //# Post to Discord
        const post = await postThread(thread);

        //# Update db
        updatePublishStatus(db, t.threadId);

        //√ Result
        resolve(post);
      }
    });
  });

  return tasks;
}
