// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IVoting.sol";

contract AnimalDAO is IVoting {
    // State variables
    address public owner;
    uint256 public minimumContribution;
    uint256 public proposalCount;
    
    // Mappings
    mapping(address => bool) public members;
    mapping(address => uint256) public contributions;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // Structs
    struct Proposal {
        string description;
        uint256 requestedAmount;
        address beneficiary;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        bool exists;
    }
    
    // Events
    event ContributionReceived(address indexed contributor, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, string description, uint256 requestedAmount);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    
    // Modifiers
    modifier onlyMember() {
        require(members[msg.sender], "Not a DAO member");
        _;
    }
    
    modifier proposalExists(uint256 proposalId) {
        require(proposals[proposalId].exists, "Proposal does not exist");
        _;
    }
    
    modifier notExecuted(uint256 proposalId) {
        require(!proposals[proposalId].executed, "Proposal already executed");
        _;
    }
    
    // Constructor
    constructor(uint256 _minimumContribution) {
        owner = msg.sender;
        minimumContribution = _minimumContribution;
    }
    
    // External functions
    function contribute() external payable {
        require(msg.value >= minimumContribution, "Contribution too low");
        _processContribution(msg.sender, msg.value);
    }
    
    function createProposal(string memory description, uint256 requestedAmount) 
        external 
        onlyMember 
        returns (uint256) 
    {
        proposalCount++;
        
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.description = description;
        newProposal.requestedAmount = requestedAmount;
        newProposal.beneficiary = msg.sender;
        newProposal.exists = true;
        
        emit ProposalCreated(proposalCount, description, requestedAmount);
        return proposalCount;
    }
    
    function vote(uint256 proposalId, bool support) 
        external 
        onlyMember 
        proposalExists(proposalId) 
        notExecuted(proposalId) 
    {
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        
        if (support) {
            proposals[proposalId].yesVotes++;
        } else {
            proposals[proposalId].noVotes++;
        }
        
        hasVoted[proposalId][msg.sender] = true;
        emit VoteCast(proposalId, msg.sender, support);
    }
    
    function executeProposal(uint256 proposalId) 
        external 
        onlyMember 
        proposalExists(proposalId) 
        notExecuted(proposalId) 
    {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.yesVotes > proposal.noVotes, "Proposal did not pass");
        require(address(this).balance >= proposal.requestedAmount, "Insufficient funds");
        
        proposal.executed = true;
        (bool success, ) = proposal.beneficiary.call{value: proposal.requestedAmount}("");
        require(success, "Transfer failed");
        
        emit ProposalExecuted(proposalId);
    }
    
    // View functions
    function getProposal(uint256 proposalId) 
        external 
        view 
        returns (
            string memory description,
            uint256 requestedAmount,
            address beneficiary,
            uint256 yesVotes,
            uint256 noVotes,
            bool executed
        ) 
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.description,
            proposal.requestedAmount,
            proposal.beneficiary,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.executed
        );
    }
    
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    

    function getMinimumVotesRequired() external pure returns (uint256) {
        return 1; 
    }
    

    function _processContribution(address contributor, uint256 amount) internal {
        if (!members[contributor]) {
            members[contributor] = true;
        }
        contributions[contributor] += amount;
        emit ContributionReceived(contributor, amount);
    }
    
    receive() external payable {
        require(msg.value >= minimumContribution, "Contribution too low");
        _processContribution(msg.sender, msg.value);
    }

    function getProposalCount() external view returns (uint256) {
        return proposalCount;
    }

     function getYesVotes(uint256 proposalId) external view returns (uint256) {
        return proposals[proposalId].yesVotes;
    }
    
    function getNoVotes(uint256 proposalId) external view returns (uint256) {
        return proposals[proposalId].noVotes;
    }
}