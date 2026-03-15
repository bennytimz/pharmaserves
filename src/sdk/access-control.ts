import nacl from "tweetnacl";
import tweetnaclUtil from "tweetnacl-util";

const { encodeBase64, decodeBase64 } = tweetnaclUtil;

export interface AccessGrant {
  grantId: string;
  blobName: string;
  grantedTo: string;
  expiresAt: Date;
  encryptedPointer: string;
  nonce: string;
}

export interface DatasetListing {
  blobName: string;
  format: string;
  size: number;
  owner: string;
  description: string;
  accessPrice: string;
  publicKey: string;
}

export class AccessController {
  private keyPair: nacl.BoxKeyPair;
  private grants: Map<string, AccessGrant> = new Map();
  private listings: Map<string, DatasetListing> = new Map();

  constructor(secretKeyBase64?: string) {
    if (secretKeyBase64) {
      const secretKey = decodeBase64(secretKeyBase64);
      this.keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
    } else {
      this.keyPair = nacl.box.keyPair();
    }
  }

  getPublicKey(): string {
    return encodeBase64(this.keyPair.publicKey);
  }

  getSecretKey(): string {
    return encodeBase64(this.keyPair.secretKey);
  }

  listDataset(
    blobName: string,
    format: string,
    size: number,
    owner: string,
    description: string,
    accessPrice: string
  ): DatasetListing {
    const listing: DatasetListing = {
      blobName,
      format,
      size,
      owner,
      description,
      accessPrice,
      publicKey: this.getPublicKey(),
    };
    this.listings.set(blobName, listing);
    return listing;
  }

  getListings(): DatasetListing[] {
    return Array.from(this.listings.values());
  }

  grantAccess(
    blobName: string,
    researcherPublicKeyBase64: string,
    expirationHours = 24
  ): AccessGrant {
    const researcherPublicKey = decodeBase64(researcherPublicKeyBase64);
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const pointer = JSON.stringify({ blobName });
    const pointerBytes = new TextEncoder().encode(pointer);

    const encryptedPointer = nacl.box(
      pointerBytes,
      nonce,
      researcherPublicKey,
      this.keyPair.secretKey
    );

    const grant: AccessGrant = {
      grantId: encodeBase64(nacl.randomBytes(16)),
      blobName,
      grantedTo: researcherPublicKeyBase64,
      expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
      encryptedPointer: encodeBase64(encryptedPointer),
      nonce: encodeBase64(nonce),
    };

    this.grants.set(grant.grantId, grant);
    return grant;
  }

  decryptGrant(
    grant: AccessGrant,
    ownerPublicKeyBase64: string,
    researcherSecretKeyBase64: string
  ): string | null {
    if (new Date() > grant.expiresAt) {
      throw new Error("Access grant has expired");
    }

    const ownerPublicKey = decodeBase64(ownerPublicKeyBase64);
    const researcherSecretKey = decodeBase64(researcherSecretKeyBase64);
    const nonce = decodeBase64(grant.nonce);
    const encryptedPointer = decodeBase64(grant.encryptedPointer);

    const decrypted = nacl.box.open(
      encryptedPointer,
      nonce,
      ownerPublicKey,
      researcherSecretKey
    );

    if (!decrypted) return null;

    const pointer = JSON.parse(new TextDecoder().decode(decrypted));
    return pointer.blobName;
  }
}