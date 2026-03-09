# ethers-kms-signer

Cloud KMS signer integration with ethers.js v6. Supports AWS KMS and GCP Cloud KMS.

## Packages

| Package | Description | Version |
| --- | --- | --- |
| [`@cuonghx.gu-tech/ethers-aws-kms-signer`](./packages/ethers-aws-kms-signer) | AWS KMS signer using `@aws-sdk/client-kms` | 0.9.0 |
| [`@cuonghx.gu-tech/ethers-gcp-kms-signer`](./packages/ethers-gcp-kms-signer) | GCP Cloud KMS signer using `@google-cloud/kms` | 0.9.1 |

## Installation

```sh
# AWS KMS
npm install @cuonghx.gu-tech/ethers-aws-kms-signer

# GCP Cloud KMS
npm install @cuonghx.gu-tech/ethers-gcp-kms-signer
```

## Usage

### AWS KMS

```javascript
import { AwsKmsSigner } from "@cuonghx.gu-tech/ethers-aws-kms-signer";

const signer = new AwsKmsSigner({
  keyId: "your-kms-key-id",
  region: "us-east-1",
  credentials: {
    accessKeyId: "your-access-key-id",
    secretAccessKey: "your-secret-access-key",
  },
});
```

### GCP Cloud KMS

Create a key in GCP Key Management with **HSM** protection and **Elliptic Curve secp256k1 - SHA256 Digest** algorithm.

```javascript
import { GcpKmsSigner } from "@cuonghx.gu-tech/ethers-gcp-kms-signer";

const signer = new GcpKmsSigner({
  projectId: "your-project-id",
  locationId: "your-location-id",
  keyRingId: "your-key-ring-id",
  keyId: "your-key-id",
  versionId: "your-version-id",
});
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Lint
npm run eslint

# Test (requires KMS credentials)
npm test
```

## License

MIT
