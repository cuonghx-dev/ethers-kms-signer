import { expect } from "chai";
import dotenv from "dotenv";

import { AwsKmsSigner } from "../src/aws-kms-signer";
import { ethers, recoverAddress, solidityPackedKeccak256 } from "ethers";

dotenv.config();

context("AwsKmsSigner", () => {
  let signer: AwsKmsSigner;

  describe("explicit credentials", () => {
    beforeEach(() => {
      signer = new AwsKmsSigner({
        keyId: process.env.TEST_KMS_KEY_ID!,
        region: process.env.TEST_KMS_REGION_ID!,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
    });

    it("Should return correct public key", async () => {
      const publicKeyBytes = ethers.decodeBase64(process.env.TEST_PUBLIC_KEY!);
      const publicKeyHash = ethers.keccak256(publicKeyBytes.slice(-64));
      const address = `0x${publicKeyHash.substring(26)}`;
      expect(await signer.getAddress()).to.eql(address);
    });

    it("Should get sign a message", async () => {
      const testMessage = "test";
      const publicAddress = await signer.getAddress();

      const signature = await signer.signMessage(testMessage);

      const eip191Hash = solidityPackedKeccak256(
        ["string", "string"],
        ["\x19Ethereum Signed Message:\n4", testMessage]
      );

      const recoveredAddress = recoverAddress(eip191Hash, signature);

      expect(recoveredAddress.toLowerCase()).to.equal(
        publicAddress.toLowerCase()
      );
    });

    it("should send a signed transaction using KMS signer", async () => {
      const provider = new ethers.JsonRpcProvider(process.env.TEST_RPC_URL);
      const wallet = ethers.Wallet.createRandom();
      const beforeBalance = await provider.getBalance(wallet.address);
      const connectedSigner = signer.connect(provider);
      const value = ethers.parseEther("0.01");
      const tx = await connectedSigner.sendTransaction({
        to: wallet.address,
        value: value,
      });
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);
      const afterBalance = await provider.getBalance(wallet.address);
      expect(afterBalance).to.equal(beforeBalance + value);
    }).timeout(60000);
  });

  describe("AWS SSO", () => {
    it("Should get sign a message", async () => {
      signer = new AwsKmsSigner({
        keyId: process.env.TEST_KMS_KEY_ID!,
        region: process.env.TEST_KMS_REGION_ID!,
      });
      const testMessage = "test";
      const publicAddress = await signer.getAddress();

      const signature = await signer.signMessage(testMessage);

      const eip191Hash = solidityPackedKeccak256(
        ["string", "string"],
        ["\x19Ethereum Signed Message:\n4", testMessage]
      );

      const recoveredAddress = recoverAddress(eip191Hash, signature);

      expect(recoveredAddress.toLowerCase()).to.equal(
        publicAddress.toLowerCase()
      );
    }).timeout(15000);
  });
});
