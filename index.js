import * as assert from "node:assert/strict";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import AbortController from "abort-controller";
import chalk from "chalk";
import { FastestNodeClient, watch } from "drand-client";
import { Wallet } from "ethers";
import {
  drandOptions,
  publishedSince,
  drandUrls,
  timeOfRound,
} from "./drand.js";
import { shuffle } from "./shuffle.js";
import { group } from "./group.js";

dotenv.config();

global.fetch = fetch;
global.AbortController = AbortController;

// Define terminal string styling
const errorColor = chalk.red;
const warningColor = chalk.yellow;
const successColor = chalk.green;
const infoColor = chalk.blue;

// Required env vars
assert.notStrictEqual(process.env.MNEMONIC, "");
const mnemonic = process.env.MNEMONIC;

const endpoint = process.env.ENDPOINT;
// assert.notStrictEqual(process.env.ENDPOINT, "");

// Optional env vars
const endpoint2 = process.env.ENDPOINT2 || null;
const endpoint3 = process.env.ENDPOINT3 || null;

const wallet = Wallet.fromPhrase(mnemonic);
const botAddress = wallet.address;

console.log(infoColor(`Bot address: ${botAddress}`));
console.log(infoColor(`Group: ${group(botAddress)}`));

// Shuffle endpoints to reduce the probability of two bots ending up with the same endpoint
shuffle(drandUrls);

async function main() {
  console.info(infoColor(`Connected to ENDPOINT ${endpoint}.`));

  // Registering this bot
  const moniker = process.env.MONIKER;
  if (moniker) {
    console.info(infoColor("Registering this bot ..."));
    //TODO: Submit register tx
  }
  
  const fastestNodeClient = new FastestNodeClient(drandUrls, drandOptions);
  fastestNodeClient.start();
  const abortController = new AbortController();
  for await (const beacon of watch(fastestNodeClient, abortController)) {
    try {
      const delay = publishedSince(beacon.round);
      console.log(beacon);
      console.log(`Got beacon #${beacon.round} after ${delay}ms.`);
    } catch (e) {
      console.error(errorColor(e.toString()));
    }
  }
}

main().then(
  () => {
    console.info("Done");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  }
);
