require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Îți trebuie un fișier .env cu aceste variabile
const PRIVATE_KEY = process.env.PRIVATE_KEY || "450df18e207a307ba044c622fee540ca239f16ec48dcdee31ffd37bf50eaf4f7";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/4F9X9uw5oe8wQn-Oor4MgYAYKgF_vIlk";

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};