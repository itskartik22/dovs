"use client";

import {useEffect, useState} from "react";
import axiosInstance from "../api/axiosInstance.js";

const CastVote = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/getAllElections");
      console.log("API Response:", res.data);
      if (res.data.success) {
        const activeElections = res.data.elections.filter(
          (e) => e.isActive === true
        );
        setElections(activeElections);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error("Error fetching elections:", err);
      setError("Failed to fetch elections.");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (electionId, candidateId) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post("/castVote", {
        electionId,
        candidateId,
        accountInd: 1, // Default Account
      });

      if (res.data.success) {
        setSuccess(`Vote Casted Successfully for Election ${electionId}!`);
        fetchElections(); // Refresh List after voting
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error("Error casting vote:", err);
      setError("Failed to cast vote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className = "p-8" >
      <h1 className = "text-3xl font-bold text-center mb-6" >Cast Your Vote</h1 >

      {error && <p className = "text-red-500 text-center" >{error}</p >}
      {success && <p className = "text-green-500 text-center" >{success}</p >}
      {loading && <p className = "text-blue-500 text-center" >Loading...</p >}

      {elections.length === 0 && !loading && (
        <p className = "text-center text-lg text-gray-500" >
          No Active Elections Found
        </p >
      )}

      <div className = {`flex gap-2 flex-wrap`} >

        {elections.map((election) => (
          <div key = {election.id} className = "border p-4 rounded-lg mb-6 shadow-lg" >
            <h2 className = "text-2xl font-bold text-center mb-4" >
              {election.name}
            </h2 >

            {election.candidates?.length > 0 ? (
              <div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
                {election.candidates.map((candidate, index) => (
                  <div key = {index} className = "border rounded p-4 shadow-md" >
                    <p className = "text-lg font-semibold" >{candidate.name}</p >
                    <button
                      onClick = {() => handleVote(election.id, index)}
                      disabled = {loading}
                      className = {`mt-3 bg-blue-500 text-white px-4 py-2 rounded ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-700"
                      }`}
                    >
                      {loading ? "Voting..." : "Vote Now"}
                    </button >
                  </div >
                ))}
              </div >
            ) : (
              <p className = "text-center text-gray-500" >No Candidates Available</p >
            )}
          </div >
        ))}
      </div >

    </div >
  );
};

export default CastVote;
