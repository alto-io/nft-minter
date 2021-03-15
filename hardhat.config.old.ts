import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig } from 'hardhat/types';

import "@nomiclabs/hardhat-etherscan";
import "hardhat-typechain";
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

// TODO: reenable solidity-coverage when it works
// import "solidity-coverage";

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const mnemonic = process.env.MNEMONIC;

const accounts = {
  mnemonic,
};

const config: HardhatUserConfig = {
  defaultNetwork: "localhost",
  solidity: {
    compilers:
  [
    { version: "0.5.12", settings: {} },
    { version: "0.6.8", settings: {} },
    { version: "0.7.1", settings: {} },
  ],
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    hardhat: {},
    localhost: {},
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts
    },
    coverage: {
      url: "http://127.0.0.1:8555", // Coverage launches its own ganache-cli client
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;