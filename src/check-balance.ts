import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

const address = process.env.PHARMASERVES_ADDRESS!;

// Check APT balance
const apt = await aptos.getAccountAPTAmount({ accountAddress: address });
console.log("APT balance:", apt);

// Check all fungible asset balances
const assets = await aptos.getCurrentFungibleAssetBalances({
  options: { where: { owner_address: { _eq: address } } }
});

console.log("\nAll token balances:");
console.log(JSON.stringify(assets, null, 2));