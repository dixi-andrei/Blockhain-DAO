const contractAddress = "0x91Eb8aaB38570D20007804c1897FF9d93651A59D"; // Adresa contractului
const abi = [ 
    "Q6X9BXPTT2XQHZVE62TX1VZ6JISMA23MQC"
 ];
let provider, signer, contract; 


window.onload = () => {
    const connectButton = document.getElementById("connectButton");
    const donateButton = document.getElementById("donateButton");
    const viewContributions = document.getElementById("viewContributions");

    connectButton.addEventListener("click", connectToMetaMask);
    donateButton.addEventListener("click", donateETH);
    viewContributions.addEventListener("click", viewUserContributions);
};

async function connectToMetaMask() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask nu este instalat!");
        return;
    }

    if (typeof ethers === "undefined") {
        console.error("Librăria ethers.js nu a fost încărcată.");
        return;
    }

    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();

        const account = await signer.getAddress();
        document.getElementById("accountInfo").textContent = `Conectat: ${account}`;

        contract = new ethers.Contract(contractAddress, abi, signer);

        document.getElementById("donate-section").classList.remove("hidden");
        document.getElementById("view-section").classList.remove("hidden");
    } catch (err) {
        console.error("Eroare conectare MetaMask:", err);
    }
}


async function donateETH() {
    const donationAmount = document.getElementById("donationAmount").value;
    if (!donationAmount || donationAmount <= 0) {
        alert("Introdu o sumă validă!");
        return;
    }

    try {
        const tx = await contract.donate({ value: ethers.utils.parseEther(donationAmount) });
        await tx.wait();
        document.getElementById("donationStatus").textContent = "Donația a fost trimisă cu succes!";
    } catch (err) {
        console.error("Eroare trimitere donație:", err);
        document.getElementById("donationStatus").textContent = "Eroare la trimiterea donației.";
    }
}

async function viewUserContributions() {
    try {
        const account = await signer.getAddress();
        const contribution = await contract.getContribution(account);
        document.getElementById("contributionAmount").textContent = `Contribuția ta: ${ethers.utils.formatEther(contribution)} ETH`;
    } catch (err) {
        console.error("Eroare afișare contribuții:", err);
        document.getElementById("contributionAmount").textContent = "Eroare la afișarea contribuțiilor.";
    }
}
