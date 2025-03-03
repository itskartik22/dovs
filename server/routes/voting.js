const express = require("express");
const router = express.Router();
const { web3, contractInstance } = require("../utils/web3");

// Route to create an election
router.post("/createElection", async (req, res) => {
  try {
    console.log("Creating Election...");
    const { name, candidates } = req.body;

    if (!name || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: 'name' and 'candidates' are required.",
      });
    }

    const accounts = await web3.eth.getAccounts();
    console.log("Using account:", accounts[0]);

    const result = await contractInstance.methods
      .createElection(name, candidates)
      .send({
        from: accounts[0], // Admin account
        gas: 3000000,
      });
    console.log("Election created with ID:", result);

    const electionCount = await contractInstance.methods.electionCount().call();
    console.log("Total Elections:", Number(electionCount));

    const newElectionId = Number(electionCount) - 1;

    res.status(200).json({
      success: true,
      electionId: newElectionId,
      message: "Election created successfully!",
    });
  } catch (error) {
    console.error("Error creating election:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create election. " + error.message,
    });
  }
});

// Route to cast a vote
router.post("/castVote", async (req, res) => {
  try {
    console.log("Casting vote...");
    const { electionId, candidateId, accountInd } = req.body;

    if (electionId === undefined || candidateId === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid request: 'electionId' and 'candidateId' are required.",
      });
    }

    const accounts = await web3.eth.getAccounts();
    console.log("Using account:", accounts[0]);

    await contractInstance.methods.vote(electionId, candidateId).send({
      from: accounts[accountInd], // Example user account (should use a dynamic user address in real applications)
      gas: 3000000,
    });

    res.status(200).json({
      success: true,
      message: "Vote cast successfully!",
    });
  } catch (error) {
    if (error.cause && error.cause.data) {
      // Decode the revert reason from the encoded data
      const revertReason = web3.utils.hexToUtf8(error.cause.data.slice(138));
      console.error("Revert Reason:", revertReason); // Prints: Election is still active
      return res.status(400).json({
        success: false,
        message: "Failed to fetch results. " + revertReason,
      });
    }
    console.error("Error fetching results:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch results. " + error.message,
    });
  }
});

// Route to get election results
router.get("/getResults/:electionId", async (req, res) => {
  try {
    console.log("Fetching election results...");
    const { electionId } = req.params;

    if (electionId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: 'electionId' is required.",
      });
    }

    // Fetch results from the contract
    const results = await contractInstance.methods
      .getResults(electionId)
      .call();

    // Convert results to a more readable format
    const convertedResults = {
      candidates: results[0].map((name, index) => ({
        name,
        votes: results[1][index].toString(), // Convert BigInt to string for JSON compatibility
      })),
    };

    res.status(200).json({
      success: true,
      results: convertedResults,
    });
  } catch (error) {
    if (error.cause && error.cause.data) {
      // Decode the revert reason from the encoded data
      const revertReason = web3.utils.hexToUtf8(error.cause.data.slice(138));
      console.error("Revert Reason:", revertReason); // Prints: Election is still active
      return res.status(400).json({
        success: false,
        message: "Failed to fetch results. " + revertReason,
      });
    }
    console.error("Error fetching results:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch results. " + error.message,
    });
  }
});

router.post("/closeElection/:electionId", async (req, res) => {
  try {
    console.log("Closing Election...");
    const { electionId } = req.params;

    if (electionId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: 'electionId' is required.",
      });
    }

    const accounts = await web3.eth.getAccounts();
    console.log("Using account:", accounts[0]);

    await contractInstance.methods.closeElection(electionId).send({
      from: accounts[0], // Admin account
      gas: 3000000,
    });

    res.status(200).json({
      success: true,
      message: "Election closed successfully!",
    });
  } catch (error) {
    console.error("Error closing election:", error);
    res.status(500).json({
      success: false,
      message: "Failed to close election. " + error.message,
    });
  }
});

// Route to get all elections
router.get("/getAllElections", async (req, res) => {
  try {
    console.log("Fetching all elections...");

    const electionsData = await contractInstance.methods.getAllElections().call();

    let elections = [];
    const electionNames = electionsData[0];  // Array of election names
    const candidateNames = electionsData[1]; // Array of candidate names per election
    // const candidateVotes = electionsData[2]; // Array of candidate votes per election (BigInt values)
    const electionStatuses = electionsData[2]; // Array of election statuses

    for (let i = 0; i < electionNames.length; i++) {
      let candidates = [];
      for (let j = 0; j < candidateNames[i].length; j++) {
        candidates.push({
          name: candidateNames[i][j],
          // voteCount: Number(candidateVotes[i][j]), // Convert BigInt to Number
        });
      }

      elections.push({
        id: i,
        name: electionNames[i],
        isActive: electionStatuses[i],
        candidates: candidates,
      });
    }

    res.status(200).json({
      success: true,
      elections,
    });
  } catch (error) {
    console.error("Error fetching elections:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch elections. " + error.message,
    });
  }
});


module.exports = router;
