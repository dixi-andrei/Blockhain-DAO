# DAO for Animal Fundraising

This project implements a **Decentralized Autonomous Organization (DAO)** designed to facilitate fundraising for animal-related causes. Built on the Ethereum blockchain, the DAO enables users to contribute, propose, vote, and execute funding decisions in a secure, transparent, and automated manner.

## 🚀 Features

- **ETH Contributions for Membership:** Users can become DAO members by contributing ETH.
- **Proposal Creation:** Members can submit funding proposals for animal-related causes.
- **Voting System:** A democratic voting mechanism allows members to vote on submitted proposals.
- **Automated Proposal Execution:** Approved proposals are automatically executed if they meet predefined thresholds.
- **On-Chain Transparency:** All actions are recorded on-chain using events, ensuring complete transparency.

---

## ⚡ Technical Architecture

The project leverages the following technologies:

- **Solidity:** Smart contracts implementing DAO logic.
- **Hardhat:** Development environment for compiling, testing, and deploying smart contracts.
- **Ethers.js:** Facilitates blockchain interactions within the frontend.
- **React:** Provides an intuitive and responsive user interface.
- **MetaMask:** Enables secure wallet interactions for ETH transactions.

---

## 🎯 Demonstration Workflow

1. **Connect Wallet:** Users connect their MetaMask wallet.
2. **Contribute ETH:** Members contribute ETH to join the DAO.
3. **Create Proposal:** Members submit funding proposals.
4. **Vote Proposal:** Members vote on proposals.
5. **Execute Proposal:** Automatically execute proposals upon reaching the required threshold.

---

## 🔒 Security Measures

- **Permission Checks:** Modifiers ensure that only authorized users perform critical actions.
- **Duplicate Vote Prevention:** The system verifies and prevents duplicate votes.
- **Threshold System:** Proposals must meet a defined threshold before execution.
- **Fund Verification:** Ensures sufficient funds are available prior to transfers.

---

## 💡 Possible Improvements

- **IPFS Integration:** For decentralized storage of detailed proposal information.
- **Governance Tokens:** Introduce tokens to represent voting power.
- **Timelock Feature:** Add timelocks to delay execution after proposal approval for added security.
- **Enhanced Proposal Analysis:** Develop a more robust interface for in-depth proposal reviews.

---

## 🛠️ How to Test

```bash
# Prepare Environment
npx hardhat clean
npx hardhat compile

# Start Local Node
npx hardhat node

# Deploy Smart Contracts
npx hardhat run scripts/deploy.js --network localhost

# Launch Frontend
cd frontend
npm install
npm start

# Connect MetaMask to localhost:8545
```

---

## ✅ Technical Requirements Fulfilled

- Usage of **Solidity-specific types** (mappings, address).
- **Events** implemented for transaction tracking.
- **Modifiers** applied for access control and security.
- Diverse **function types** (external, view, pure).
- ETH **transfer functionality** integrated.
- **Smart contract interaction** fully operational.
- **Frontend** connected using **Web3** technologies.

---

## 🌟 Key Highlights

- **Fully Functional DAO System:** End-to-end fundraising DAO for animal causes.
- **Modular & Extensible Architecture:** Designed for easy future enhancements.
- **Robust Security Practices:** Implemented through Solidity best practices.
- **Intuitive UI/UX:** Responsive frontend enabling seamless user interaction.

---

## 💾 Repository Structure

```plaintext
├── contracts/             # Solidity smart contracts
├── scripts/               # Deployment scripts
├── test/                  # Testing files for smart contracts
├── frontend/              # React frontend application
│   ├── src/
│   └── public/
├── hardhat.config.js      # Hardhat configuration
└── README.md              # Project documentation
```

---

## 💻 Running the Project

```bash
# Clone the repository
git clone https://github.com/username/dao-animal-fundraising.git
cd dao-animal-fundraising

# Install dependencies
npm install

# Start local blockchain node
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Run frontend
cd frontend
npm install
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---



## 🌐 Live Demo

[Access Live Application](https://your-live-demo-link.com)

---

This project represents a secure, transparent, and democratic approach to fundraising for animal-related causes, leveraging the power of blockchain technology. ⭐

