import { PharmaServesClient } from "../sdk/index.js";
import * as dotenv from "dotenv";

dotenv.config();

const client = new PharmaServesClient({
  apiKey: process.env.SHELBY_API_KEY!,
  privateKey: process.env.PHARMASERVES_PRIVATE_KEY!,
  network: "testnet",
});

console.log("PharmaServesClient initialized ✓");
console.log("Address:", client.address);

// Test registry
console.log("\nFetching dataset registry...");
const datasets = await client.registry();

console.log(`\n${datasets.length} datasets on PharmaServes:\n`);
datasets.forEach((d) => {
  console.log(`  ${d.name}`);
  console.log(`    Format: ${d.format} | Size: ${d.size} B | Status: ${d.status}`);
});

// Test streamToBuffer
console.log("\nStreaming VCF dataset...");
const buffer = await client.streamToBuffer(
  "datasets/african-reference/sample-001.vcf"
);
console.log(`✓ Streamed ${buffer.length} bytes`);
console.log("\nFirst 100 bytes:");
console.log(buffer.toString("utf-8").slice(0, 100));

console.log("\n✓ pharmaserves-sdk working perfectly 🧬");