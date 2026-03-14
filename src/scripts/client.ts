import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";
import { Network } from "@aptos-labs/ts-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.SHELBY_API_KEY;

if (!apiKey) {
  throw new Error("SHELBY_API_KEY is missing from .env");
}

export const shelbyClient = new ShelbyNodeClient({
  network: Network.TESTNET,
  apiKey,
});

console.log("PharmaServes client initialized on testnet ✓");