// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IAnimalFundraiser {
    function donate() external payable;
}

contract DonationHelper {
    address public fundraiserAddress;

    constructor(address _fundraiserAddress) {
        fundraiserAddress = _fundraiserAddress;
    }

    function donateOnBehalf() public payable {
        require(msg.value > 0, "Donation must be greater than zero");
        IAnimalFundraiser(fundraiserAddress).donate{value: msg.value}();
    }
}
