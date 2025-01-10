import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [votingPanels, setVotingPanels] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [voteChoice, setVoteChoice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedAddress = localStorage.getItem("user-address");
    if (storedAddress) {
      setUserAddress(storedAddress);
    }

    // Fetch voting panels from the backend
    fetchVotingPanels();
  }, []);

  const fetchVotingPanels = async () => {
    try {
      // Replace with your backend API endpoint to fetch elections
      const response = await fetch("/api/votingPanels");
      const panels = await response.json();
      setVotingPanels(panels);
    } catch (error) {
      console.error("Error fetching voting panels:", error);
    }
  };

  const handleVote = async () => {
    if (!selectedElection || !voteChoice) {
      alert("Please select an election and a candidate to vote for.");
      return;
    }

    try {
      // Make a POST request to the backend to cast the vote
      const response = await fetch("/api/castVote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electionId: selectedElection,
          voteChoice: voteChoice,
          userAddress: userAddress,
        }),
      });

      if (response.ok) {
        alert("Vote successfully casted!");
        navigate("/results"); // Redirect to results page if desired
      } else {
        alert("Error casting vote.");
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("There was an error casting your vote.");
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("user-address");
    setUserAddress(null);
    alert(
      "Your cached wallet address has been removed. Don't forget to disconnect your wallet from MetaMask."
    );

    // Inform user to manually switch accounts or networks in MetaMask
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          alert(
            "Your MetaMask wallet has been disconnected. Please switch to a new account."
          );
        }
      });
    }
  };

  return (
    <div className="h-screen flex flex-col items-center space-y-7 py-8">
      <h2 className="text-4xl font-bold text-indigo-900">Dashboard</h2>

      {userAddress ? (
        <div className="text-lg text-gray-800 flex flex-col gap-2 items-center">
          <p>
            Connected Wallet Address: {userAddress.slice(0, 6)}...
            {userAddress.slice(-4)}
          </p>
          <button
            onClick={handleDisconnect}
            className="mt-2 py-2 px-4 bg-red-600 text-white rounded-md"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <p className="text-red-500">
          Please connect your wallet to access the dashboard.
        </p>
      )}

      <div className="w-full max-w-md">
        <h3 className="text-2xl font-semibold text-indigo-800">
          Voting Panels
        </h3>
        <ul className="space-y-4 mt-4">
          {votingPanels.map((panel) => (
            <li
              key={panel.id}
              className="p-4 border border-gray-300 rounded-lg"
            >
              <h4 className="text-xl font-semibold">{panel.name}</h4>
              <div className="mt-2">
                <select
                  onChange={(e) => setVoteChoice(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                  disabled={!userAddress}
                >
                  <option value="">Select Candidate</option>
                  {panel.candidates.map((candidate, idx) => (
                    <option key={idx} value={candidate}>
                      {candidate}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setSelectedElection(panel.id)}
                className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-md"
                disabled={!userAddress}
              >
                Select Election
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedElection && (
        <div className="mt-8 text-center">
          <button
            onClick={handleVote}
            className="py-2 px-4 bg-green-600 text-white rounded-2xl"
          >
            Cast Vote
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
