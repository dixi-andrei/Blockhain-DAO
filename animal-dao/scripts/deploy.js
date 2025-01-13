const hre = require("hardhat");

async function main() {
  const minimumContribution = ethers.utils.parseEther("0.001"); // 0.01 ETH minimum contribution
  
  const AnimalDAO = await hre.ethers.getContractFactory("AnimalDAO");
  const animalDAO = await AnimalDAO.deploy(minimumContribution);

  await animalDAO.deployed();

  console.log("AnimalDAO deployed to:", animalDAO.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });