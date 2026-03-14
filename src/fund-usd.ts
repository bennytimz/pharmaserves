import * as dotenv from "dotenv";

dotenv.config();

const address = process.env.PHARMASERVES_ADDRESS!;
const faucetUrl = `https://faucet.shelbynet.shelby.xyz/fund?asset=shelbyusd&address=${address}`;

console.log("Requesting ShelbyUSD from faucet...");

const response = await fetch(faucetUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ address }),
});

const text = await response.text();

console.log("Status:", response.status);
console.log("Response:", text);