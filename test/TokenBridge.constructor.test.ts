import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TokenBridge, TokenBridge__factory } from "../typechain-types";
import { getAddress } from "./utils";

describe("TokenBridge.constructor", () => {
  let tokenBridge : TokenBridge;
  let owner : SignerWithAddress;

  before(async () => {
    [owner] = await ethers.getSigners();
  });

  it("Must throw an exception if token address is zero", async () => {
    await expect(new TokenBridge__factory(owner).deploy(ethers.constants.AddressZero))
      .to.revertedWith("TokenBridge: address can't be a zero");
  });

  it("Must constructor contract correctly", async () => {
    const tokenAddress = await getAddress(1);

    tokenBridge = await new TokenBridge__factory(owner).deploy(tokenAddress);

    expect(await tokenBridge.token()).to.eq(tokenAddress);
    expect(await tokenBridge.chainId()).to.eq((await ethers.provider.getNetwork()).chainId);
    expect(await tokenBridge.owner()).to.eq(owner.address);
  });
});
