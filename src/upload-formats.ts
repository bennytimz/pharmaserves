import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";
import { Account, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const client = new ShelbyNodeClient({
  network: Network.TESTNET,
  apiKey: process.env.SHELBY_API_KEY!,
});

const account = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(process.env.PHARMASERVES_PRIVATE_KEY!),
});

const expiration = (Date.now() + 7 * 24 * 60 * 60 * 1000) * 1000;

// FASTQ format — raw sequencing reads
const fastqData = `@SAMPLE001.1 read1 length=50
ACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTAC
+
IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
@SAMPLE001.2 read2 length=50
TGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATG
+
IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
@SAMPLE001.3 HBB_gene_region length=50
CTTGCCCCACAGGGCAGTAACGGCAGACTTCTCCTCAGGAGTCAGGTGCA
+
IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII`.trim();

// SAM format — sequence alignment (text equivalent of BAM)
const samData = `@HD\tVN:1.6\tSO:coordinate
@SQ\tSN:chr11\tLN:135086622
@RG\tID:SAMPLE001\tSM:SAMPLE001\tPL:ILLUMINA
SAMPLE001.1\t0\tchr11\t5246696\t60\t50M\t*\t0\t0\tCTTGCCCCACAGGGCAGTAACGGCAGACTTCTCCTCAGGAGTCAGGTGCA\tIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII\tRG:Z:SAMPLE001
SAMPLE001.2\t0\tchr11\t5246746\t60\t50M\t*\t0\t0\tGTGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATG\tIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII\tRG:Z:SAMPLE001`.trim();

const datasets = [
  {
    data: fastqData,
    name: "datasets/african-reference/sample-001.fastq",
    format: "FASTQ",
  },
  {
    data: samData,
    name: "datasets/african-reference/sample-001.sam",
    format: "SAM/BAM",
  },
];

for (const dataset of datasets) {
  const blobData = Buffer.from(dataset.data, "utf-8");
  console.log(`\nUploading ${dataset.format} file...`);
  console.log("File:", dataset.name);
  console.log("Size:", blobData.length, "bytes");

  await client.upload({
    signer: account,
    blobData,
    blobName: dataset.name,
    expirationMicros: expiration,
  });

  console.log(`✓ ${dataset.format} uploaded successfully`);
}

console.log("\n🧬 PharmaServes now stores VCF, FASTQ, and SAM/BAM on Shelby");
console.log("Full genomic data stack on decentralized hot storage.");