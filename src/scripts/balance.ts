import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

const balance = await aptos.getAccountAPTAmount({
  accountAddress: process.env.PHARMASERVES_ADDRESS!,
});

console.log("APT balance:", balance);