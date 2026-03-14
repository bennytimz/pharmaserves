import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";
import { Network } from "@aptos-labs/ts-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const client = new ShelbyNodeClient({
  network: Network.TESTNET,
  apiKey: process.env.SHELBY_API_KEY!,
});

const account = process.env.PHARMASERVES_ADDRESS!;

const blobs = await client.coordination.getAccountBlobs({ account });

console.log("╔════════════════════════════════════════════════════╗");
console.log("║         PharmaServes Dataset Registry              ║");
console.log("║     Decentralized Genomic Storage on Shelby        ║");
console.log("╚════════════════════════════════════════════════════╝\n");
console.log(`Account: ${account}`);
console.log(`Total datasets: ${blobs.length}\n`);

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatExpiry = (micros: number) => {
  return new Date(micros / 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getFormat = (name: string) => {
  if (name.endsWith(".vcf")) return "VCF  — Variant Call Format";
  if (name.endsWith(".fastq")) return "FASTQ — Raw Sequencing Reads";
  if (name.endsWith(".sam")) return "SAM  — Sequence Alignment Map";
  if (name.endsWith(".bam")) return "BAM  — Binary Alignment Map";
  return "Unknown format";
};

blobs.forEach((blob, i) => {
  const status = blob.isWritten ? "✓ STORED" : "⏳ PENDING";
  console.log(`Dataset ${i + 1}: ${blob.blobNameSuffix}`);
  console.log(`  Format:   ${getFormat(blob.blobNameSuffix)}`);
  console.log(`  Size:     ${formatSize(blob.size)}`);
  console.log(`  Status:   ${status}`);
  console.log(`  Expires:  ${formatExpiry(blob.expirationMicros)}`);
  console.log(`  Created:  ${formatExpiry(blob.creationMicros)}`);
  console.log(`  Encoding: Clay codes — ${blob.encoding.erasure_n} chunks (${blob.encoding.erasure_k} data + ${blob.encoding.erasure_n - blob.encoding.erasure_k} parity)`);
  console.log();
});

console.log("════════════════════════════════════════════════════");
console.log(`${blobs.filter(b => b.isWritten).length}/${blobs.length} datasets fully stored on Shelby testnet`);