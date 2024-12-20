const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const AnimalFundraiser = await hre.ethers.getContractFactory("AnimalFundraiser");
    const fundraiser = await AnimalFundraiser.deploy();

    await fundraiser.deployed();
    console.log("AnimalFundraiser deployed to:", fundraiser.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
