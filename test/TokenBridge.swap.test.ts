import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TokenBridge } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("TokenBridge.constructor", () => {
  const value = 100;
  const chainId = 15;

  let user : SignerWithAddress;
  let deployer : SignerWithAddress;
  let tokenBridge : TokenBridge;

  async function tokenBridgeInitializeFixture() {
    const [deployer, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token", deployer);
    const token = await Token.deploy("test", "test");
    await token.deployed();

    const TokenBridge = await ethers.getContractFactory("TokenBridge", deployer);
    const tokenBridge = await TokenBridge.deploy(token.address);
    await tokenBridge.deployed();

    await token.approve(tokenBridge.address, ethers.utils.parseEther("100000"));
    return {tokenBridge, deployer, user};
  }

  beforeEach(async () => {
    ({tokenBridge, deployer, user} = await loadFixture(tokenBridgeInitializeFixture));
  });

  it("Must emit Swapped event correctly", async () => {
    await expect(tokenBridge.connect(deployer).swap(user.address, value, chainId))
      .to.emit(tokenBridge, "Swapped")
      .withArgs(
        user.address,
        value,
        1, // nonce
        chainId
      );
  });

  it("Must increment nonce correctly", async () => {
    expect(await tokenBridge.nonce()).to.eq(1);

    await tokenBridge.connect(deployer).swap(user.address, value, chainId);

    expect(await tokenBridge.nonce()).to.eq(2);
  });
});
