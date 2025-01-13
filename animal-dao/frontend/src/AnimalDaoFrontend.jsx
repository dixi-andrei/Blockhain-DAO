import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import AnimalDAO from '../../artifacts/contracts/AnimalDAO.sol/AnimalDAO.json';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function AnimalDAOFrontend() {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('contribute');
    const [userBalance, setUserBalance] = useState('0');
    const [daoBalance, setDaoBalance] = useState('0');
    const [contribution, setContribution] = useState('');
    const [proposals, setProposals] = useState([]);
    const [newProposal, setNewProposal] = useState({ description: '', amount: '' });


    const [debug, setDebug] = useState({
        contractInitialized: false,
        lastError: null,
        lastAction: null
    });

    // Modified initializeEthers with debug logs
    const initializeEthers = useCallback(async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, AnimalDAO.abi, signer);
            
            setContract(contractInstance);
            
            // Get initial balances
            const account = await signer.getAddress();
            setAccount(account);
            
            // Get DAO balance
            const daoBalance = await contractInstance.getBalance();
            setDaoBalance(ethers.utils.formatEther(daoBalance));
            
            // Get user balance
            const userBalance = await provider.getBalance(account);
            setUserBalance(ethers.utils.formatEther(userBalance));
            
            // Load proposals
            loadProposals(contractInstance);
            
        } catch (err) {
            console.error("Initialization error:", err);
            alert("Failed to initialize the application");
        }
    }, []);


    // Modified updateBalances with debug logs
    const updateBalances = async (currentAccount, currentContract, provider) => {
        try {
            if (currentAccount && provider) {
                const balance = await provider.getBalance(currentAccount);
                setUserBalance(ethers.utils.formatEther(balance));
                console.log('Updated user balance:', ethers.utils.formatEther(balance));
            }

            if (currentContract) {
                const daoBalance = await currentContract.getBalance();
                setDaoBalance(ethers.utils.formatEther(daoBalance));
                console.log('Updated DAO balance:', ethers.utils.formatEther(daoBalance));
            }
        } catch (error) {
            console.error("Error updating balances:", error);
            setDebug(prev => ({...prev, lastError: 'Balance update failed'}));
        }
    };
    // Modified loadProposals with debug logs
    const loadProposals = async (contractInstance) => {
        try {
            const count = await contractInstance.getProposalCount();
            const loadedProposals = [];
            
            for (let i = 1; i <= count; i++) {
                const proposal = await contractInstance.getProposal(i);
                const yesVotes = await contractInstance.getYesVotes(i);
                const noVotes = await contractInstance.getNoVotes(i);
                
                loadedProposals.push({
                    id: i,
                    description: proposal.description,
                    requestedAmount: ethers.utils.formatEther(proposal.requestedAmount),
                    beneficiary: proposal.beneficiary,
                    yesVotes: yesVotes.toString(),
                    noVotes: noVotes.toString(),
                    executed: proposal.executed
                });
            }
            
            setProposals(loadedProposals);
        } catch (error) {
            console.error("Error loading proposals:", error);
        }
    };

    // Connect wallet
    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            await initializeEthers();
        } catch (err) {
            console.error("Error connecting wallet:", err);
            alert('Failed to connect wallet');
        }
    };

    // Handle contribution
    const handleContribute = async () => {
        try {
            setLoading(true);
            const tx = await contract.contribute({
                value: ethers.utils.parseEther(contribution)
            });
            await tx.wait();
            
            // Update balances
            const daoBalance = await contract.getBalance();
            setDaoBalance(ethers.utils.formatEther(daoBalance));
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const userBalance = await provider.getBalance(account);
            setUserBalance(ethers.utils.formatEther(userBalance));
            
            setContribution('');
            alert("Contribution successful!");
        } catch (error) {
            console.error("Error contributing:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };


    // Handle proposal creation
    const handleCreateProposal = async () => {
        try {
            setLoading(true);
            const tx = await contract.createProposal(
                newProposal.description,
                ethers.utils.parseEther(newProposal.amount)
            );
            await tx.wait();
            
            // Reload proposals
            loadProposals(contract);
            
            setNewProposal({ description: '', amount: '' });
            alert("Proposal created successfully!");
        } catch (error) {
            console.error("Error creating proposal:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    // Vote on proposal
    const handleVote = async (proposalId, support) => {
        try {
            setLoading(true);
            const tx = await contract.vote(proposalId, support);
            await tx.wait();
            
            // Reload proposals to update votes
            loadProposals(contract);
            
            alert("Vote cast successfully!");
        } catch (error) {
            console.error("Error voting:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initializeEthers();
    }, [initializeEthers]);


    useEffect(() => {
        initializeEthers();
        
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount('');
                }
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
            }
        };
    }, [initializeEthers]);

    useEffect(() => {
        if (contract) {
            loadProposals();
        }
    }, [contract, loadProposals]);

    const TabButton = ({ name, label }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 rounded-t-lg ${
                activeTab === name 
                ? 'bg-white text-blue-600 border-t-2 border-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );

     // Modified renderProposals with vote counts
     const renderProposals = () => (
        <div className="space-y-4">
            {proposals.map((proposal) => (
                <div key={proposal.id} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold">{proposal.description}</h3>
                    <p className="text-gray-600">Amount: {proposal.amount} ETH</p>
                    <div className="mt-2 text-sm">
                        <p>Yes Votes: {proposal.yesVotes}</p>
                        <p>No Votes: {proposal.noVotes}</p>
                        <p>Status: {proposal.executed ? 'Executed' : 'Pending'}</p>
                    </div>
                    <div className="mt-2 flex space-x-2">
                        <button 
                            onClick={() => handleVote(proposal.id, true)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            disabled={proposal.executed}
                        >
                            Support
                        </button>
                        <button 
                            onClick={() => handleVote(proposal.id, false)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            disabled={proposal.executed}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderDebugPanel = () => (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm">
            <h3 className="font-bold">Debug Info</h3>
            <p>Contract Initialized: {debug.contractInitialized ? 'Yes' : 'No'}</p>
            <p>Last Action: {debug.lastAction}</p>
            <p>Last Error: {debug.lastError || 'None'}</p>
            <button 
                onClick={loadProposals}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
                Refresh Proposals
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="flex items-center justify-between mb-8">
                                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                                        Animal DAO
                                    </h1>
                                    {account && (
                                        <div className="text-sm bg-gray-100 rounded-full px-4 py-2">
                                            {`${account.slice(0, 6)}...${account.slice(-4)}`}
                                        </div>
                                    )}
                                </div>

                                {!account ? (
                                    <div className="flex flex-col items-center space-y-6">
                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold mb-2">Welcome to Animal DAO</h2>
                                            <p className="text-gray-600">Connect your wallet to start contributing</p>
                                        </div>
                                        <button 
                                            onClick={connectWallet}
                                            className="transform transition-all hover:scale-105 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Connect Wallet
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                                            <p className="text-gray-600 mb-2">Your Balance</p>
                                            <p className="text-3xl font-bold text-gradient">{userBalance} ETH</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                                            <p className="text-gray-600 mb-2">DAO Balance</p>
                                            <p className="text-3xl font-bold text-gradient">{daoBalance} ETH</p>
                                        </div>

                                        <div className="flex space-x-4 border-b">
                                            <TabButton name="contribute" label="Contribute" />
                                            <TabButton name="propose" label="New Proposal" />
                                            <TabButton name="view" label="View Proposals" />
                                        </div>

                                        {activeTab === 'contribute' && (
                                            <div className="space-y-4">
                                                <h2 className="text-xl font-bold">Make a Contribution</h2>
                                                <div className="space-y-4">
                                                    <input
                                                        type="number"
                                                        value={contribution}
                                                        onChange={(e) => setContribution(e.target.value)}
                                                        placeholder="Amount in ETH"
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                    <button
                                                        onClick={handleContribute}
                                                        disabled={loading || !contribution}
                                                        className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-3 rounded-lg font-medium hover:from-green-500 hover:to-green-600 transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {loading ? 'Processing...' : 'Contribute'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'propose' && (
                                            <div className="space-y-4">
                                                <h2 className="text-xl font-bold">Create New Proposal</h2>
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        value={newProposal.description}
                                                        onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                                                        placeholder="Proposal Description"
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={newProposal.amount}
                                                        onChange={(e) => setNewProposal({...newProposal, amount: e.target.value})}
                                                        placeholder="Requested Amount (ETH)"
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                    <button
                                                        onClick={handleCreateProposal}
                                                        disabled={loading || !newProposal.description || !newProposal.amount}
                                                        className="w-full bg-gradient-to-r from-purple-400 to-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-500 hover:to-purple-600 transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {loading ? 'Processing...' : 'Create Proposal'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'view' && (
                                            <div className="space-y-4">
                                                <h2 className="text-xl font-bold">Active Proposals</h2>
                                                {proposals.length === 0 ? (
                                                    <p className="text-gray-500 text-center py-8">No active proposals</p>
                                                ) : (
                                                    renderProposals()
                                                )}
                                                
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Error/Success Toast Notifications */}
            <div className="fixed bottom-4 right-4 z-50">
                {/* Add toast notifications here if needed */}
            </div>
            {renderDebugPanel()}
        </div>
        
    );
}

export default AnimalDAOFrontend;