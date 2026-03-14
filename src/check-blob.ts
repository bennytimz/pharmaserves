import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";
import { Network } from "@aptos-labs/ts-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const client = new ShelbyNodeClient({
  network: Network.TESTNET,
  apiKey: process.env.SHELBY_API_KEY!,
});

const blobs = await client.coordination.getAccountBlobs({
  account: process.env.PHARMASERVES_ADDRESS!,
});

console.log("Blobs registered for PharmaServes account:");
console.log(JSON.stringify(blobs, null, 2));