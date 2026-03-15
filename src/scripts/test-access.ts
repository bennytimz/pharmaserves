import { AccessController } from "../sdk/index.js";

console.log("╔════════════════════════════════════════════════════╗");
console.log("║     PharmaServes Access Control Demo               ║");
console.log("╚════════════════════════════════════════════════════╝\n");

// --- DATA PROVIDER (Nigerian biobank) ---
console.log("[ DATA PROVIDER — Nigerian Genomics Institute ]");
const provider = new AccessController();
console.log("Provider public key:", provider.getPublicKey().slice(0, 20) + "...");

// List a dataset on the marketplace
const listing = provider.listDataset(
  "datasets/african-reference/sample-001.vcf",
  "VCF",
  527,
  "0x941383cb5616216f9ddcad7ffcfb0503eef392d7d615fda5f72209a9d9ad03db",
  "African variant call dataset — chromosome 11 HBB gene region (sickle cell)",
  "0.01 ShelbyUSD per read"
);

console.log("\nDataset listed on PharmaServes marketplace:");
console.log(`  Name:        ${listing.blobName}`);
console.log(`  Format:      ${listing.format}`);
console.log(`  Description: ${listing.description}`);
console.log(`  Price:       ${listing.accessPrice}`);

// --- RESEARCHER (Pharma company) ---
console.log("\n[ RESEARCHER — AI Drug Discovery Lab ]");
const researcher = new AccessController();
console.log("Researcher public key:", researcher.getPublicKey().slice(0, 20) + "...");

// Provider grants 24-hour access to researcher
console.log("\n[ GRANTING ACCESS — 24 hour window ]");
const grant = provider.grantAccess(
  "datasets/african-reference/sample-001.vcf",
  researcher.getPublicKey(),
  24
);

console.log("Grant ID:", grant.grantId);
console.log("Expires:", grant.expiresAt.toLocaleString());
console.log("Encrypted pointer:", grant.encryptedPointer.slice(0, 30) + "...");

// Researcher decrypts the grant and gets blob access
console.log("\n[ RESEARCHER DECRYPTS GRANT ]");
const blobName = researcher.decryptGrant(
  grant,
  provider.getPublicKey(),
  researcher.getSecretKey()
);

if (blobName) {
  console.log("✓ Access granted!");
  console.log("Decrypted blob name:", blobName);
  console.log("\nResearcher can now stream:");
  console.log(`  shelby.download({ account: "${listing.owner}", blobName: "${blobName}" })`);
} else {
  console.log("✗ Decryption failed");
}

// Test expired grant
console.log("\n[ TESTING EXPIRED GRANT ]");
const expiredGrant = provider.grantAccess(
  "datasets/african-reference/sample-001.vcf",
  researcher.getPublicKey(),
  0
);
expiredGrant.expiresAt = new Date(Date.now() - 1000);

try {
  researcher.decryptGrant(expiredGrant, provider.getPublicKey(), researcher.getSecretKey());
} catch (e: any) {
  console.log("✓ Expired grant correctly rejected:", e.message);
}

console.log("\n════════════════════════════════════════════════════");
console.log("Access control layer working — PharmaServes DRM ✓ 🧬");