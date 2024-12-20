require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
    solidity: "0.8.28",
    networks: {
        goerli: {
            url: "https://eth-sepolia.g.alchemy.com/v2/pelHxWVA0CLZOITSIGetmSaJ1FLeYx0Z",
            accounts: ["450df18e207a307ba044c622fee540ca239f16ec48dcdee31ffd37bf50eaf4f7"]
        }
    },
    etherscan: {
        apiKey: "Q6X9BXPTT2XQHZVE62TX1VZ6JISMA23MQC"
    }
};
