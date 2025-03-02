// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    address public owner;

    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Election {
        string name;
        Candidate[] candidates;
        mapping(address => bool) hasVoted;
        bool isActive;
    }

    Election[] public elections;
    uint public electionCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyValidElection(uint _electionId) {
        require(_electionId < elections.length, "Invalid election ID");
        _;
    }

    modifier onlyActiveElection(uint _electionId) {
        require(elections[_electionId].isActive, "Election is not active");
        _;
    }

    modifier onlyAfterElection(uint _electionId) {
        require(!elections[_electionId].isActive, "Election is still active");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Create a new election
    function createElection(string memory _name, string[] memory _candidates) public onlyOwner returns (uint) {
        Election storage newElection = elections.push();
        newElection.name = _name;
        newElection.isActive = true;

        for (uint i = 0; i < _candidates.length; i++) {
            newElection.candidates.push(Candidate({ name: _candidates[i], voteCount: 0 }));
        }

        electionCount++; // Increment election count
        return electionCount - 1; // Return the new election ID
    }

    // Cast a vote
    function vote(uint _electionId, uint _candidateId)
        public
        onlyValidElection(_electionId)
        onlyActiveElection(_electionId)
    {
        Election storage election = elections[_electionId];
        require(!election.hasVoted[msg.sender], "You have already voted");
        require(_candidateId < election.candidates.length, "Invalid candidate ID");

        election.candidates[_candidateId].voteCount++;
        election.hasVoted[msg.sender] = true;
    }

    // Get results of an election
    function getResults(uint _electionId)
        public
        view
        onlyValidElection(_electionId)
        onlyAfterElection(_electionId)
        returns (string[] memory, uint[] memory)
    {
        Election storage election = elections[_electionId];
        uint candidateCount = election.candidates.length;

        string[] memory names = new string[](candidateCount);
        uint[] memory votes = new uint[](candidateCount);

        for (uint i = 0; i < candidateCount; i++) {
            names[i] = election.candidates[i].name;
            votes[i] = election.candidates[i].voteCount;
        }

        return (names, votes);
    }

    // Close an election
    function closeElection(uint _electionId) public onlyOwner onlyValidElection(_electionId) {
        elections[_electionId].isActive = false;
    }
}
