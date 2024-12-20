// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AnimalFundraiser {
    address public owner;
    uint public totalFunds;
    
    // Mapping pentru a înregistra contribuțiile
    mapping(address => uint) public contributions;

    // Evenimente
    event DonationReceived(address indexed donor, uint amount);
    event FundsTransferred(address indexed to, uint amount);

    // Modificatori
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyPositiveAmount(uint amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Funcție external pentru donații (payable pentru a primi ETH)
    function donate() external payable onlyPositiveAmount(msg.value) {
        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    // Funcție view pentru a vedea contribuția unui utilizator
    function getContribution(address donor) external view returns (uint) {
        return contributions[donor];
    }

    // Funcție pură pentru a calcula un procent
    function calculatePercentage(uint amount, uint percent) public pure returns (uint) {
        return (amount * percent) / 100;
    }

    // Funcție pentru a transfera ETH (doar owner-ul)
    function transferFunds(address payable to, uint amount) external onlyOwner onlyPositiveAmount(amount) {
        require(amount <= totalFunds, "Insufficient funds");
        totalFunds -= amount;
        to.transfer(amount);
        emit FundsTransferred(to, amount);
    }

    // Funcție de fallback pentru a primi ETH
    receive() external payable {
        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }
}
