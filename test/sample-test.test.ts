import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { ContractName, ContractName__factory } from "../typechain-types";

describe("ContractName.methodName", () => {
  let contractName : ContractName;
  let owner : Signer;
  let user : Signer;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    contractName = await new ContractName__factory(owner).deploy();
  });

  it("must bla bla", async () => {
    const tx = await contractName.methodName();
  });
});
