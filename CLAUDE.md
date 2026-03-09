# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Lerna monorepo providing ethers.js v6 `AbstractSigner` implementations backed by cloud KMS (AWS and GCP).

## Packages

- `packages/ethers-aws-kms-signer` — `AwsKmsSigner` using `@aws-sdk/client-kms`
- `packages/ethers-gcp-kms-signer` — `GcpKmsSigner` using `@google-cloud/kms`

## Commands

All commands run from individual package directories (e.g., `cd packages/ethers-aws-kms-signer`):

```bash
# Build (TypeScript → dist/)
npm run build

# Lint
npm run eslint

# Tests (signer packages only, requires KMS credentials)
npm test
# Single test file
npx ts-mocha --files -r tsconfig-paths/register test/some-file.spec.ts
```

Install dependencies from repo root:
```bash
npm install
```

## Architecture

Both signers follow the same pattern:
1. Extend `ethers.AbstractSigner` and implement `getAddress()`, `signTransaction()`, `signMessage()`, `signTypedData()`
2. `getAddress()` fetches the public key from KMS, parses the ASN.1 `SubjectPublicKeyInfo` via `@peculiar/asn1-*`, strips the `0x04` prefix, and derives the Ethereum address via `keccak256`
3. `_sign(digest)` sends a 32-byte digest to KMS for ECDSA signing, parses the ASN.1 `ECDSASigValue`, normalizes `s` to low-s (EIP-2), and recovers `v` by comparing the recovered address

## Key Dependencies

- `ethers` v6 — core Ethereum library
- `@peculiar/asn1-ecc`, `@peculiar/asn1-schema`, `@peculiar/asn1-x509` — ASN.1 parsing for KMS public keys and signatures
- Testing: Mocha + Chai via `ts-mocha`

## npm Scope

All packages publish under `@cuonghx.gu-tech/` with public access.
