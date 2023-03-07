import fetch from "node-fetch";
import * as dotenv from "dotenv";
dotenv.config();

import {
  threadListFormat,
  threadFirstPostDiscord,
} from "../utils/formatter.js";

const apiURL = process.env.API_URL;
const discordId = process.env.DISCORD_ID;
const discordToken = process.env.DISCORD_TOKEN;

//Hengame
// const discordId = "1080556583202848799";
// const discordToken =
//   "KZAj88N_ijivRnhfYqqcUJUdYZaLlc82valj64-L0V4b_0faTupSIQV8-QIdkkkiaGA2";

const discordURL = `https://discord.com/api/webhooks/${discordId}/${discordToken}`;

export async function fetchToday() {
  console.log("Fetching list.");
  return fetch(`${apiURL}/v1/today`)
    .then((result) => result.json())
    .then((json) => threadListFormat(json.data.today));
}

export async function fetchThread(name) {
  return fetch(`${apiURL}/v1/thread/${name}`)
    .then((result) => result.json())
    .then((json) => threadFirstPostDiscord(json));
}

export async function postThread(post) {
  return fetch(discordURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
}
