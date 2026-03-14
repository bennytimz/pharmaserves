import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";
import { Account, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";

export interface PharmaServesConfig {
  apiKey: string;
  privateKey: string;
  network?: "testnet" | "shelbynet";
}

export interface DatasetMetadata {
  name: string;
  format: string;
  size: number;
  status: "stored" | "pending";
  expiresAt: Date;
  createdAt: Date;
  encoding: {
    variant: string;
    totalChunks: number;
    dataChunks: number;
    parityChunks: number;
  };
}

export class PharmaServesClient {
  private shelby: ShelbyNodeClient;
  public account: Account;
  public address: string;

  constructor(config: PharmaServesConfig) {
    const network =
      config.network === "shelbynet" ? Network.SHELBYNET : Network.TESTNET;

    this.shelby = new ShelbyNodeClient({ network, apiKey: config.apiKey });

    this.account = Account.fromPrivateKey({
      privateKey: new Ed25519PrivateKey(config.privateKey),
    });

    this.address = this.account.accountAddress.toString();
  }

  async upload(
    data: Buffer,
    blobName: string,
    expirationDays = 7
  ): Promise<void> {
    const expirationMicros =
      (Date.now() + expirationDays * 24 * 60 * 60 * 1000) * 1000;
    await this.shelby.upload({
      signer: this.account,
      blobData: data,
      blobName,
      expirationMicros,
    });
  }

  async download(blobName: string, range?: { start: number; end?: number }) {
    return this.shelby.download({
      account: this.address,
      blobName,
      range,
    });
  }

  async streamToBuffer(blobName: string, range?: { start: number; end?: number }): Promise<Buffer> {
    const { Readable } = await import("stream");
    const blob = await this.download(blobName, range);
    const readable = Readable.fromWeb(blob.readable as any);
    const chunks: Buffer[] = [];
    for await (const chunk of readable) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async registry(): Promise<DatasetMetadata[]> {
    const blobs = await this.shelby.coordination.getAccountBlobs({
      account: this.address,
    });

    return blobs.map((blob) => ({
      name: blob.blobNameSuffix,
      format: this.detectFormat(blob.blobNameSuffix),
      size: blob.size,
      status: blob.isWritten ? "stored" : "pending",
      expiresAt: new Date(blob.expirationMicros / 1000),
      createdAt: new Date(blob.creationMicros / 1000),
      encoding: {
        variant: blob.encoding.variant,
        totalChunks: blob.encoding.erasure_n,
        dataChunks: blob.encoding.erasure_k,
        parityChunks: blob.encoding.erasure_n - blob.encoding.erasure_k,
      },
    }));
  }

  private detectFormat(name: string): string {
    if (name.endsWith(".vcf")) return "VCF";
    if (name.endsWith(".fastq")) return "FASTQ";
    if (name.endsWith(".sam")) return "SAM";
    if (name.endsWith(".bam")) return "BAM";
    if (name.endsWith(".fasta") || name.endsWith(".fa")) return "FASTA";
    return "Unknown";
  }
}