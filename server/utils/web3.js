const { Web3 } = require("web3");

// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

// Replace with your contract's ABI and address
const contractABI = require("./../../blockchain/build/contracts/VotingSystem.json").abi;
const contractAddress = "0xBcB80562DdfD09894d6cCbf7D23A78B5A3A52c7b"; // Replace this with the actual address

// Initialize the contract instance
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

module.exports = { web3, contractInstance };
