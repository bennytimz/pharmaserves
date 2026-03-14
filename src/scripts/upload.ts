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

const vcfData = `##fileformat=VCFv4.2
##FILTER=<ID=PASS,Description="All filters passed">
##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE001
1\t1105366\trs2887286\tC\tT\t.\tPASS\tAF=0.32;DP=45\tGT\t0/1
1\t2160305\trs1058205\tT\tC\t.\tPASS\tAF=0.18;DP=38\tGT\t0/0
11\t5246945\trs334\tA\tT\t.\tPASS\tAF=0.001;DP=52\tGT\t0/1
16\t89919736\trs11644125\tA\tG\t.\tPASS\tAF=0.44;DP=61\tGT\t1/1`.trim();

const blobData = Buffer.from(vcfData, "utf-8");
const blobName = "datasets/african-reference/sample-001.vcf";
const expirationMicros = (Date.now() + 7 * 24 * 60 * 60 * 1000) * 1000;

console.log("Uploading genomic dataset to Shelby...");
console.log("File:", blobName);
console.log("Size:", blobData.length, "bytes");
console.log("Account:", account.accountAddress.toString());

try {
  const result = await client.upload({
    signer: account,
    blobData,
    blobName,
    expirationMicros,
  });

  console.log("\nResult received:", typeof result);
  console.log(JSON.stringify(result, null, 2));

  if (result?.transaction) {
    console.log("\n✓ Upload successful!");
    console.log("Transaction:", result.transaction.hash);
    console.log("Blob:", `${account.accountAddress.toString()}/${blobName}`);
    console.log("\nPharmaServes just stored its first genomic dataset on Shelby 🧬");
  }
} catch (err: any) {
  console.log("\n✗ Upload failed:");
  console.log("Message:", err.message);
  if (err.transaction) {
    console.log("Transaction hash:", err.transaction.hash);
    console.log("VM status:", err.transaction.vm_status);
  }
}