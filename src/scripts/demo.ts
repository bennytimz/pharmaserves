import { PharmaServesClient, AccessController } from "../sdk/index.js";
import * as dotenv from "dotenv";

dotenv.config();

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const log = (msg: string) => console.log(msg);
const step = (n: number, msg: string) => {
  console.log(`\n${"═".repeat(54)}`);
  console.log(`  STEP ${n}: ${msg}`);
  console.log(`${"═".repeat(54)}`);
};

log("\n╔══════════════════════════════════════════════════════╗");
log("║         PharmaServes — Full Demo                     ║");
log("║  Decentralized Genomic Data for African Drug         ║");
log("║  Discovery, built on Shelby Protocol                 ║");
log("╚══════════════════════════════════════════════════════╝");

// --- INIT ---
step(1, "Initialize PharmaServes Client");
const client = new PharmaServesClient({
  apiKey: process.env.SHELBY_API_KEY!,
  privateKey: process.env.PHARMASERVES_PRIVATE_KEY!,
  network: "testnet",
});
log(`✓ Connected to Shelby testnet`);
log(`✓ Account: ${client.address}`);

// --- UPLOAD ---
step(2, "Upload African Genomic Dataset (VCF)");
const vcfData = Buffer.from(`##fileformat=VCFv4.2
##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
11\t5246945\trs334\tA\tT\t.\tPASS\tAF=0.001
11\t5246746\trs3333\tG\tA\t.\tPASS\tAF=0.003`.trim(), "utf-8");

const blobName = "datasets/african-reference/demo-hbb-gene.vcf";
log(`Uploading: ${blobName}`);
log(`Format: VCF — HBB gene region (sickle cell)`);
log(`Size: ${vcfData.length} bytes`);

await client.upload(vcfData, blobName, 7);
log(`✓ Dataset stored on Shelby — erasure coded across 16 nodes`);

// --- REGISTRY ---
step(3, "View Dataset Registry");
const datasets = await client.registry();
log(`✓ ${datasets.length} datasets stored on PharmaServes:\n`);
datasets.forEach(d => {
  log(`  ${d.name}`);
  log(`    Format: ${d.format} | Size: ${d.size}B | Status: ${d.status}`);
});

// --- RANGE REQUEST ---
step(4, "Range Request — Stream Specific Genomic Region");
const start = Date.now();
const partial = await client.streamToBuffer(blobName, { start: 0, end: 100 });
const latency = Date.now() - start;
log(`✓ Streamed bytes 0-100 in ${latency}ms from decentralized storage`);
log(`Content preview: ${partial.toString("utf-8").slice(0, 80)}...`);

// --- ACCESS CONTROL ---
step(5, "Access Control — Grant & Decrypt");
log("[ Nigerian Biobank — Data Provider ]");
const provider = new AccessController();

provider.listDataset(
  blobName, "VCF", vcfData.length,
  client.address,
  "HBB gene variants — African reference panel (sickle cell research)",
  "0.01 ShelbyUSD per read"
);
log(`✓ Dataset listed on PharmaServes marketplace`);
log(`  Price: 0.01 ShelbyUSD per read`);

await sleep(500);
log("\n[ AI Drug Discovery Lab — Researcher ]");
const researcher = new AccessController();
log(`✓ Researcher key generated`);

const grant = provider.grantAccess(blobName, researcher.getPublicKey(), 24);
log(`✓ 24-hour access grant issued`);
log(`  Grant ID: ${grant.grantId.slice(0, 20)}...`);
log(`  Expires: ${grant.expiresAt.toLocaleString()}`);
log(`  Pointer: encrypted — only the researcher can read this`);

await sleep(500);
const decryptedBlob = researcher.decryptGrant(
  grant,
  provider.getPublicKey(),
  researcher.getSecretKey()
);
log(`\n✓ Researcher decrypted grant`);
log(`  Access to: ${decryptedBlob}`);

// --- STREAM INTO PIPELINE ---
step(6, "Stream Dataset into Drug Discovery Pipeline");
const fullData = await client.streamToBuffer(decryptedBlob!);
log(`✓ Streamed ${fullData.length} bytes from Shelby into pipeline`);
log(`\nDataset contents:`);
log(`${"─".repeat(54)}`);
log(fullData.toString("utf-8"));
log(`${"─".repeat(54)}`);

// --- SUMMARY ---
log(`\n╔══════════════════════════════════════════════════════╗`);
log(`║              Demo Complete ✓                         ║`);
log(`╠══════════════════════════════════════════════════════╣`);
log(`║  ✓ Genomic data uploaded to Shelby testnet           ║`);
log(`║  ✓ Erasure coded across 16 storage nodes             ║`);
log(`║  ✓ Range request: ${latency}ms read latency                ║`);
log(`║  ✓ Access grant issued + decrypted                   ║`);
log(`║  ✓ Dataset streamed into drug discovery pipeline     ║`);
log(`║                                                      ║`);
log(`║  github.com/bennytimz/pharmaserves                   ║`);
log(`║  npmjs.com/package/pharmaserves-sdk                  ║`);
log(`╚══════════════════════════════════════════════════════╝\n`);