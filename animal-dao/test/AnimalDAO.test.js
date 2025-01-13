const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AnimalDAO", function () {
  let AnimalDAO;
  let animalDAO;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const minimumContribution = ethers.utils.parseEther("0.01");
    
    AnimalDAO = await ethers.getContractFactory("AnimalDAO");
    animalDAO = await AnimalDAO.deploy(minimumContribution);
    await animalDAO.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await animalDAO.owner()).to.equal(owner.address);
    });

    it("Should set the minimum contribution", async function () {
      expect(await animalDAO.minimumContribution()).to.equal(ethers.utils.parseEther("0.01"));
    });
  });

  describe("Contributions", function () {
    it("Should accept contributions above minimum", async function () {
      const contributionAmount = ethers.utils.parseEther("0.02");
      await expect(animalDAO.connect(addr1).contribute({ value: contributionAmount }))
        .to.emit(animalDAO, "ContributionReceived")
        .withArgs(addr1.address, contributionAmount);
    });

    it("Should reject contributions below minimum", async function () {
      const contributionAmount = ethers.utils.parseEther("0.005");
      await expect(
        animalDAO.connect(addr1).contribute({ value: contributionAmount })
      ).to.be.revertedWith("Contribution too low");
    });
  });

  describe("Proposals", function () {
    beforeEach(async function () {
        // Contribute from addr1
        await animalDAO.connect(addr1).contribute({
            value: ethers.utils.parseEther("0.02")
        });
        // Contribute from owner
        await animalDAO.connect(owner).contribute({
            value: ethers.utils.parseEther("0.02")
        });
    });

    it("Should create a proposal", async function () {
        const value = ethers.utils.parseEther("0.01");
        await expect(
            animalDAO.connect(owner).createProposal("Help local shelter", value)
        )
            .to.emit(animalDAO, "ProposalCreated")
            .withArgs(1, "Help local shelter", value);
    });

    it("Should allow voting on proposals", async function () {
        const value = ethers.utils.parseEther("0.01");
        await animalDAO.connect(owner).createProposal("Help local shelter", value);
        
        await expect(animalDAO.connect(addr1).vote(1, true))
            .to.emit(animalDAO, "VoteCast")
            .withArgs(1, addr1.address, true);
    });
});
});
