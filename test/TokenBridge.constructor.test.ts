import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TokenBridge__factory } from "../typechain-types";
import { getAddress } from "./utils";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("TokenBridge.constructor", () => {
  let owner : SignerWithAddress;
  let TokenBridge : TokenBridge__factory;

  async function tokenBridgeInitializeFixture() {
    const [owner] = await ethers.getSigners();

    const TokenBridge = await ethers.getContractFactory("TokenBridge");

    return {TokenBridge, owner};
  }

  beforeEach(async () => {
    ({TokenBridge, owner} = await loadFixture(tokenBridgeInitializeFixture));
  })

  it("Must throw an exception if token address is zero", async () => {
    await expect(TokenBridge.deploy(ethers.constants.AddressZero))
      .to.revertedWith("TokenBridge: address can't be a zero");
  });

  it("Must constructor contract correctly", async () => {
    const tokenAddress = await getAddress(1);

    const tokenBridge = await TokenBridge.deploy(tokenAddress);
    await tokenBridge.deployed();

    expect(await tokenBridge.token()).to.eq(tokenAddress);
    expect(await tokenBridge.chainId()).to.eq((await ethers.provider.getNetwork()).chainId);
    expect(await tokenBridge.owner()).to.eq(owner.address);
  });
});
