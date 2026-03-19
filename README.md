# PharmaServes

> Decentralized hot storage for African genomic data — built on Shelby Protocol testnet

[![npm](https://img.shields.io/npm/v/pharmaserves-sdk)](https://www.npmjs.com/package/pharmaserves-sdk)
[![GitHub](https://img.shields.io/github/license/bennytimz/pharmaserves)](https://github.com/bennytimz/pharmaserves)

## What is PharmaServes?

African genomes are the most genetically diverse and least studied in the world. Researchers working on sickle cell disease, malaria, and other conditions that disproportionately affect African populations are bottlenecked by inaccessible, expensive, and slow genomic data infrastructure.

PharmaServes is an open-source infrastructure layer that enables African biobanks, research institutions, and pharmaceutical researchers to store, stream, and monetize genomic datasets on the Shelby decentralized hot storage network — at sub-second read speeds, with micropayment-per-read economics and encrypted access control.

## Demo

Full end-to-end demo — upload → registry → range request → access grant → stream:
```bash
npx tsx src/scripts/demo.ts
```

## Architecture
```
[ African Genomic Data Repository ]  ← VCF, FASTQ, SAM stored on Shelby testnet
           ↓
[ DRM Access Control Layer ]         ← encrypted time-limited access grants
           ↓
[ Biobank Marketplace ]              ← micropayment-per-read economics
           ↓
[ pharmaserves-sdk ]                 ← TypeScript SDK for developers
           ↓
[ Research Pipeline Connectors ]     ← stream directly into AlphaFold, AutoDock Vina
```

## Why Shelby?

Filecoin and Arweave are cold storage — unsuitable for AI drug discovery pipelines that need millisecond reads. Shelby's erasure-coded architecture (Clay codes, 16 chunks per dataset), dedicated fiber backbone, read-incentivized nodes, and programmable access control are the exact primitives PharmaServes is built around.

## Installation
```bash
npm install pharmaserves-sdk
```

## Quick Start
```typescript
import { PharmaServesClient, AccessController } from "pharmaserves-sdk";

// Initialize client
const client = new PharmaServesClient({
  apiKey: "your_shelby_api_key",
  privateKey: "your_aptos_private_key",
  network: "testnet",
});

// Upload a genomic dataset
await client.upload(vcfBuffer, "datasets/african-reference/sample.vcf", 7);

// View dataset registry
const datasets = await client.registry();

// Stream a specific byte range (e.g. chromosome 11 region)
const region = await client.streamToBuffer("datasets/african-reference/sample.vcf", {
  start: 0,
  end: 1000,
});

// Grant a researcher time-limited access
const provider = new AccessController();
const grant = provider.grantAccess(blobName, researcherPublicKey, 24);

// Researcher decrypts grant and streams data
const researcher = new AccessController();
const blobName = researcher.decryptGrant(grant, provider.getPublicKey(), researcher.getSecretKey());
const data = await client.streamToBuffer(blobName);
```

## Supported Genomic Formats

| Format | Description | Use Case |
|--------|-------------|----------|
| VCF | Variant Call Format | Genomic variant data, SNP analysis |
| FASTQ | Raw sequencing reads | Next-generation sequencing output |
| SAM/BAM | Sequence Alignment Map | Read alignment to reference genome |
| FASTA | Reference sequences | Genome assembly, gene sequences |

## Key Features

**Decentralized Storage**
Genomic datasets are erasure coded using Clay codes across 16 storage nodes on Shelby testnet. 10 data chunks + 6 parity chunks — zero data loss even if nodes go offline.

**Range Requests**
Stream only the genomic region you need. A researcher studying the HBB gene doesn't need to download a 40GB whole genome file — they request bytes 5,000,000–6,000,000 and pay only for what they read.

**Encrypted Access Control**
Data providers issue time-limited, encrypted access grants to researchers. Grants auto-expire. Every access is auditable. No lawyers, no data brokers — just cryptography.

**Micropayment Economics**
African biobanks earn in real time, every time their data is accessed. Built on Shelby's native micropayment channel infrastructure.

## Scripts
```bash
# Fund account with APT
npx tsx src/scripts/fund.ts

# Fund account with ShelbyUSD
npx tsx src/scripts/fund-usd.ts

# Upload VCF, FASTQ, SAM formats
npx tsx src/scripts/upload-formats.ts

# View dataset registry
npx tsx src/scripts/registry.ts

# Stream a specific byte range
npx tsx src/scripts/range-download.ts

# Test access control flow
npx tsx src/scripts/test-access.ts

# Full end-to-end demo
npx tsx src/scripts/demo.ts
```

## Network

Running on Shelby testnet.

| Component | URL |
|-----------|-----|
| Shelby RPC | `https://api.testnet.shelby.xyz/shelby` |
| Aptos Full Node | `https://api.testnet.aptoslabs.com/v1` |
| Smart Contract | `0xc63d6a5efb0080a6029403131715bd4971e1149f7cc099aac69bb0069b3ddbf5` |

## Roadmap

- [x] Shelby client on testnet
- [x] Account funding (APT + ShelbyUSD)
- [x] VCF, FASTQ, SAM uploads — all `isWritten: true`
- [x] Range requests — stream specific byte regions
- [x] Dataset registry — human-readable metadata
- [x] `pharmaserves-sdk` — published on npm
- [x] Access control — encrypted grants + expiry enforcement
- [x] End-to-end demo script
- [ ] Aptos Move smart contract — on-chain access control
- [ ] Biobank marketplace UI
- [ ] AlphaFold pipeline connector

## Built With

- [Shelby Protocol](https://shelby.xyz) — Decentralized hot storage
- [Aptos](https://aptoslabs.com) — Blockchain coordination layer
- [tweetnacl](https://github.com/dchest/tweetnacl-js) — Cryptographic access control
- TypeScript

## License

MIT