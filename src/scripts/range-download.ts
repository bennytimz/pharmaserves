import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";
import { Network } from "@aptos-labs/ts-sdk";
import * as dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

const client = new ShelbyNodeClient({
  network: Network.TESTNET,
  apiKey: process.env.SHELBY_API_KEY!,
});

const account = process.env.PHARMASERVES_ADDRESS!;
const blobName = "datasets/african-reference/sample-001.vcf";

// Stream only bytes 0-200 (first portion of the file)
const range = { start: 0, end: 200 };

console.log("Streaming genomic region from Shelby...");
console.log("Blob:", blobName);
console.log("Range:", `bytes ${range.start}-${range.end}`);

const blob = await client.download({
  account,
  blobName,
  range,
});

console.log("\nBlob metadata:");
console.log("  Name:", blob.name);
console.log("  Content length:", blob.contentLength, "bytes");

console.log("\n--- Partial dataset stream ---");

const readable = Readable.fromWeb(blob.readable as any);
const chunks: Buffer[] = [];

for await (const chunk of readable) {
  chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
}

const content = Buffer.concat(chunks).toString("utf-8");
console.log(content);
console.log("--- End of stream ---");

console.log(`\n✓ Streamed ${content.length} bytes (range ${range.start}-${range.end}) from Shelby 🧬`);
console.log("Full file is 527 bytes — we only fetched the region we needed");