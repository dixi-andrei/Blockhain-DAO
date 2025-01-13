// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVoting {
    function createProposal(string memory description, uint256 requestedAmount) external returns (uint256);
    function vote(uint256 proposalId, bool support) external;
    function executeProposal(uint256 proposalId) external;
}