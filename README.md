# PharmaServes

> Decentralized genomic data storage layer for African drug discovery — built on Shelby Protocol

## What is PharmaServes?

PharmaServes is an open-source infrastructure layer that enables African biobanks, research institutions, and pharmaceutical researchers to store, stream, and monetize genomic datasets on the Shelby decentralized hot storage network.

African genomes are the most genetically diverse and least studied in the world. Researchers working on diseases like sickle cell disease, malaria, and other conditions that disproportionately affect African populations are bottlenecked by inaccessible, expensive, and slow genomic data infrastructure. PharmaServes fixes that.

## Architecture
```
[ African Genomic Data Repository ]  ← curated dataset storage on Shelby
           ↓
[ DRM Access Control Layer ]         ← smart contract-gated blob access
           ↓
[ Biobank Marketplace ]              ← micropayment-per-read economics
           ↓
[ pharmaserves-sdk ]                 ← TypeScript SDK for developers
           ↓
[ Research Pipeline Connectors ]     ← AlphaFold, AutoDock Vina, SWISS-ADME
```

## Why Shelby?

Filecoin and Arweave are cold storage — unsuitable for AI drug discovery pipelines that need millisecond reads. Shelby's erasure-coded architecture, dedicated fiber backbone, read-incentivized nodes, and programmable access control are the exact primitives PharmaServes is built around.

## Getting Started

### Prerequisites
- Node.js v18+
- An API key from [geomi.dev](https://geomi.dev)
- A funded Aptos account on shelbynet

### Installation
```bash
git clone https://github.com/bennytimz/pharmaserves.git
cd pharmaserves
npm install
```

### Configuration

Create a `.env` file:
```env
SHELBY_API_KEY=your_api_key_here
SHELBY_NETWORK=shelbynet
PHARMASERVES_ADDRESS=your_aptos_address
PHARMASERVES_PRIVATE_KEY=your_private_key
```

### Fund your account
```bash
npx tsx src/fund.ts        # Fund with APT
npx tsx src/fund-usd.ts    # Fund with ShelbyUSD
```

### Upload a genomic dataset
```bash
npx tsx src/upload.ts
```

### Download and stream a dataset
```bash
npx tsx src/download.ts
```

### Check stored blobs
```bash
npx tsx src/check-blob.ts
```

## Network

Currently running on `shelbynet` — Shelby's developer prototype network.

| Component | URL |
|---|---|
| Shelby RPC | `https://api.shelbynet.shelby.xyz/shelby` |
| Aptos Full Node | `https://api.shelbynet.shelby.xyz/v1` |
| Indexer | `https://api.shelbynet.shelby.xyz/v1/graphql` |

## Roadmap

- [x] Shelby client initialization on shelbynet
- [x] Account funding (APT + ShelbyUSD)
- [x] Genomic dataset upload (VCF format)
- [x] Dataset streaming and download
- [ ] DRM access control smart contract (Aptos Move)
- [ ] Biobank marketplace UI
- [ ] `pharmaserves-sdk` npm package
- [ ] AlphaFold pipeline connector
- [ ] Testnet deployment

## Built With

- [Shelby Protocol](https://shelby.xyz) — Decentralized hot storage
- [Aptos](https://aptoslabs.com) — Blockchain coordination layer
- TypeScript

## License

MIT