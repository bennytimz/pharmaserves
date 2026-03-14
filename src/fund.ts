import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";
import { Account, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const client = new ShelbyNodeClient({
  network: Network.SHELBYNET,
  apiKey: process.env.SHELBY_API_KEY!,
});

const account = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(process.env.PHARMASERVES_PRIVATE_KEY!),
});

const address = account.accountAddress.toString();
console.log("Funding account:", address);

await client.fundAccountWithAPT({ address });
console.log("APT funded ✓");

await client.fundAccountWithShelbyUSD({ address });
console.log("ShelbyUSD funded ✓");

console.log("Account fully funded and ready ✓");