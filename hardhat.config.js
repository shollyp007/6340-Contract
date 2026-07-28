import "dotenv/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

// Secrets are read from the .env file in this folder (loaded above by dotenv).
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? "";
const STUNT_WALLET_PRIVATE_KEY = process.env.STUNT_WALLET_PRIVATE_KEY;

// Only pass an account if a private key is actually set, otherwise Hardhat's
// config validation rejects `[undefined]`.
const accounts = STUNT_WALLET_PRIVATE_KEY ? [STUNT_WALLET_PRIVATE_KEY] : [];

/** @type {import("hardhat/config").HardhatUserConfig} */
export default {
  // Hardhat 3 loads functionality through a plugins array instead of require().
  plugins: [hardhatToolboxMochaEthers],

  solidity: {
    version: "0.8.27", // keep in sync with the pragma in contracts/*.sol
    settings: {
      optimizer: {
        enabled: false, // enabling can cause source-verification mismatches
      },
    },
  },

  // Hardhat 3 requires an explicit `type` per network: "edr" (in-process) or "http".
  networks: {
    // Local in-memory network used for `npx hardhat test`.
    hardhat: {
      type: "edr-simulated",
      chainType: "l1",
      chainId: 31337,
    },
    polygon: {
      type: "http",
      chainType: "l1",
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts,
      chainId: 137,
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts,
      chainId: 11155111,
    },
    ethereum: {
      type: "http",
      chainType: "l1",
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts,
      chainId: 1,
    },
  },

  // Etherscan v2 uses a single API key across all supported chains.
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY,
    },
  },
};
