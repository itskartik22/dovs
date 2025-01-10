const express = require("express");
const router = express.Router();
const { web3, contractInstance } = require("../utils/web3");

router.post("/createElection", async (req, res) => {
  try {
    console.log("createElection");
    const { name, candidates } = req.body;
    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);

    await contractInstance.methods.createElection(name, candidates).send({
      from: accounts[0], // Admin account
      gas: 3000000,
    });

    res.status(200).json({ success: true, message: "Election created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


router.post("/castVote", async (req, res) => {
    try {
      const { electionId, candidateId } = req.body;
      const accounts = await web3.eth.getAccounts();
  
      await contractInstance.methods.castVote(electionId, candidateId).send({
        from: accounts[candidateId], // Example user account
        gas: 3000000,
      });
  
      res.status(200).json({ success: true, message: "Vote cast successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  

//   router.get("/getResults/:electionId", async (req, res) => {
//     try {
//       const { electionId } = req.params;
  
//       const results = await contractInstance.methods.getResults(electionId).call();
//       res.status(200).json({ success: true, results });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   });

router.get("/getResults/:electionId", async (req, res) => {
    try {
      console.log("Fetching results...");
      const { electionId } = req.params;
  
      // Fetch results from the contract
      const results = await contractInstance.methods.getResults(electionId).call();
  
      // Convert BigInt to regular numbers
      const convertedResults = {
        candidates: results[0].map((name, index) => ({
          name,
          votes: results[1][index].toString(), // Converting BigInt to string
        }))
      };
  
      res.status(200).json({ success: true, results: convertedResults });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  