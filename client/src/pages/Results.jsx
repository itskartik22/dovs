"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance.js";

const Results = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/getAllElections");
      if (res.data.success) {
        setElections(res.data.elections);
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
      setError("Failed to fetch elections.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetResult = async (electionId) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/getResults/${electionId}`);
      if (res.data.success) {
        setElections((prevElections) =>
          prevElections.map((election) =>
            election.id === electionId
              ? { ...election, results: res.data.results }
              : election
          )
        );
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 items-center flex-col">
      <p className="bg-red-200 text-2xl font-bold flex justify-center w-full">
        Results
      </p>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {loading && <p className="text-blue-500 text-center">Loading...</p>}

      {elections.length > 0 ? (
        elections.map((election) => (
          <div key={election.id} className="bg-green-300 p-4 mt-4 w-full">
            <div className="flex justify-between">
              <p className="font-bold">{election.name}</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => handleGetResult(election.id)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Show Results"}
              </button>
            </div>

            {election.results && (
              <div className="bg-yellow-200 p-4 mt-2">
                <h2 className="text-lg font-bold mb-2">Results</h2>
                {election.results.candidates.map((candidate, index) => (
                  <p key={index}>
                    {candidate.name} - {candidate.votes} Votes
                  </p>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center">No elections available</p>
      )}
    </div>
  );
};

export default Results;
