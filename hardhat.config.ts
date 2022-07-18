import dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";

import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter"; // https://www.npmjs.com/package/hardhat-gas-reporter
import "@nomiclabs/hardhat-etherscan"; // https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan
import "hardhat-dependency-compiler"; // https://www.npmjs.com/package/hardhat-dependency-compiler
import "solidity-coverage"; // https://www.npmjs.com/package/solidity-coverage
import "hardhat-storage-layout"; // https://www.npmjs.com/package/hardhat-storage-layout
import "@typechain/hardhat"; // https://www.npmjs.com/package/@typechain/hardhat
import "hardhat-contract-sizer"; // https://www.npmjs.com/package/hardhat-contract-sizer

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_, {ethers}) => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

dotenv.config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    version: process.env.COMPILE_VERSION || "0.8.4",
    settings: {
      optimizer: {
        enabled: process.env.OPTIMIZER == "true",
        runs: process.env.OPTIMIZER_RUNS || 200,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      }
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS == "true"
  },
  defaultNetwork: process.env.DEFAULT_NETWORK || "hardhat",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URI || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  dependencyCompiler: { // add your dependencies here
    paths: [
      "@openzeppelin/contracts/token/ERC20/IERC20.sol",
      "@openzeppelin/contracts/token/ERC20/ERC20.sol",
      "@openzeppelin/contracts/access/Ownable.sol"  
    ],
  }
};

export default config;
