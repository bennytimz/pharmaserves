import { PharmaServesClient } from "../sdk/index.js";
import * as dotenv from "dotenv";

dotenv.config();

const client = new PharmaServesClient({
  apiKey: process.env.SHELBY_API_KEY!,
  privateKey: process.env.PHARMASERVES_PRIVATE_KEY!,
  network: "testnet",
});

const blobs = [
  { name: "datasets/african-reference/sample-001.vcf", label: "VCF (527B)" },
  { name: "datasets/african-reference/sample-001.fastq", label: "FASTQ (408B)" },
  { name: "datasets/african-reference/sample-001.sam", label: "SAM (403B)" },
  { name: "datasets/african-reference/demo-hbb-gene.vcf", label: "VCF HBB (200B)" },
];

const RUNS = 5;

console.log("╔══════════════════════════════════════════════════════╗");
console.log("║       PharmaServes Read Latency Benchmark            ║");
console.log("║       Shelby Testnet — Decentralized Storage         ║");
console.log("╚══════════════════════════════════════════════════════╝\n");
console.log(`Running ${RUNS} reads per dataset...\n`);

const results: { label: string; avg: number; min: number; max: number }[] = [];

for (const blob of blobs) {
  const times: number[] = [];

  process.stdout.write(`Benchmarking ${blob.label}... `);

  for (let i = 0; i < RUNS; i++) {
    const start = Date.now();
    await client.streamToBuffer(blob.name);
    times.push(Date.now() - start);
    process.stdout.write(`${i + 1} `);
  }

  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  const min = Math.min(...times);
  const max = Math.max(...times);

  results.push({ label: blob.label, avg, min, max });
  console.log(`✓`);
}

console.log("\n════════════════════════════════════════════════════════");
console.log("  Results\n");
console.log(`  ${"Dataset".padEnd(20)} ${"Avg".padStart(8)} ${"Min".padStart(8)} ${"Max".padStart(8)}`);
console.log(`  ${"─".repeat(48)}`);

results.forEach(r => {
  console.log(`  ${r.label.padEnd(20)} ${(r.avg + "ms").padStart(8)} ${(r.min + "ms").padStart(8)} ${(r.max + "ms").padStart(8)}`);
});

const overallAvg = Math.round(results.reduce((a, b) => a + b.avg, 0) / results.length);
console.log(`  ${"─".repeat(48)}`);
console.log(`  ${"Overall average".padEnd(20)} ${(overallAvg + "ms").padStart(8)}`);
console.log("\n════════════════════════════════════════════════════════");
console.log(`\n✓ PharmaServes reads genomic data from decentralized`);
console.log(`  storage in ${overallAvg}ms average on Shelby testnet 🧬`);