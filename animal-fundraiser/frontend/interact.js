const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "0x91Eb8aaB38570D20007804c1897FF9d93651A59D"; // Înlocuiește cu adresa contractului tău
    const abi = [
        // ABI-ul contractului tău. Poți să-l copiezi din artefactele generate de Hardhat (folderul artifacts/contracts/AnimalFundraiser.json).
    ];

    const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/pelHxWVA0CLZOITSIGetmSaJ1FLeYx0Z");
    const wallet = new ethers.Wallet("450df18e207a307ba044c622fee540ca239f16ec48dcdee31ffd37bf50eaf4f7", provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    // Exemplu: Trimite o donație
    const tx = await contract.donate({ value: ethers.utils.parseEther("0.1") });
    console.log("Transaction sent, waiting for confirmation...");
    await tx.wait();
    console.log("Donation successful!");

    // Exemplu: Verifică contribuția utilizatorului
    const contribution = await contract.getContribution(wallet.address);
    console.log(`Contribution for ${wallet.address}: ${ethers.utils.formatEther(contribution)} ETH`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
