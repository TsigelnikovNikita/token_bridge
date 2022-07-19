import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Token, TokenBridge } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("TokenBridge.reedem", () => {
  const value = 100;
  const nonce = 1;
  let chainId : number;

  let user : SignerWithAddress;
  let deployer : SignerWithAddress;
  let tokenBridge : TokenBridge;
  let token : Token;

  async function tokenBridgeInitializeFixture() {
    const [deployer, user] = await ethers.getSigners();
    const chainId = (await ethers.provider.getNetwork()).chainId;

    const Token = await ethers.getContractFactory("Token", deployer);
    const token = await Token.deploy("test", "test");
    await token.deployed();

    const TokenBridge = await ethers.getContractFactory("TokenBridge", deployer);
    const tokenBridge = await TokenBridge.deploy(token.address);
    await tokenBridge.deployed();

    await token.connect(deployer).transfer(tokenBridge.address, ethers.utils.parseEther("100000"));
    return {tokenBridge, token, deployer, user, chainId};
  }

  beforeEach(async () => {
    ({tokenBridge, token, deployer, user, chainId} = await loadFixture(tokenBridgeInitializeFixture));
  });

  it("Must transfer tokens correctly", async () => {
    const msg = ethers.utils.solidityKeccak256(
        ["address", "uint256", "uint256", "uint256", "address"],
        [user.address, value, nonce, chainId, tokenBridge.address]
    );
    const signature = await deployer.signMessage(ethers.utils.arrayify(msg));
    const splitSignature = ethers.utils.splitSignature(signature);

    const tx = tokenBridge.connect(user)
      .reedem(user.address, value, nonce, splitSignature.v, splitSignature.r, splitSignature.s);

    await expect(await tx)
      .to.changeTokenBalances(token, [tokenBridge, user], [-100, 100]);
  });

  it("Must throw an exception if message is already was handled", async () => {
    const msg = ethers.utils.solidityKeccak256(
        ["address", "uint256", "uint256", "uint256", "address"],
        [user.address, value, nonce, chainId, tokenBridge.address]
    );
    const signature = await deployer.signMessage(ethers.utils.arrayify(msg));
    const splitSignature = ethers.utils.splitSignature(signature);

    await tokenBridge.connect(user)
      .reedem(user.address, value, nonce, splitSignature.v, splitSignature.r, splitSignature.s);

    const tx = tokenBridge.connect(user)
      .reedem(user.address, value, nonce, splitSignature.v, splitSignature.r, splitSignature.s);
    await expect(tx)
      .to.be.rejectedWith("TokenBridge: message is already handled");
  });

  it("Must throw an exception if incorrect signature was provided", async () => {
    const msg = ethers.utils.solidityKeccak256(["string"], [""]);
    const signature = await deployer.signMessage(ethers.utils.arrayify(msg));
    const splitSignature = ethers.utils.splitSignature(signature);

    const tx = tokenBridge.connect(user)
      .reedem(user.address, value, nonce, splitSignature.v, splitSignature.r, splitSignature.s);

    await expect(tx)
      .to.be.rejectedWith("TokenBridge: incorrect signature");
  });
});
