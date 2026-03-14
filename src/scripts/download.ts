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

console.log("Downloading genomic dataset from Shelby...");
console.log("Blob:", `${account}/${blobName}`);

const blob = await client.download({
  account,
  blobName,
});

console.log("\nBlob metadata:");
console.log("  Name:", blob.name);
console.log("  Size:", blob.contentLength, "bytes");

// Stream the content and print it
console.log("\n--- Dataset contents ---");

const readable = Readable.fromWeb(blob.readable as any);
const chunks: Buffer[] = [];

for await (const chunk of readable) {
  chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
}

const content = Buffer.concat(chunks).toString("utf-8");
console.log(content);
console.log("--- End of dataset ---");

console.log("\n✓ Genomic dataset successfully streamed from Shelby 🧬");
console.log("  Read", content.length, "bytes from decentralized storage");