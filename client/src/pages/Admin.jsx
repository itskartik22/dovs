import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import CreateElection from "./CreateElection";
import ManageElections from "./ManageElections";
import ResultsDisplay from "./ResultsDisplay";

const Admin = () => {
  const [elections, setElections] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllElections();
  }, []);

  const fetchAllElections = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axiosInstance.get("/getAllElections");
      console.log(response.data.elections);
      const formattedElections = response.data.elections.map(e => ({
        ...e,
        name: Array.isArray(e.name) ? e.name.join("") : e.name,
      }));
      setElections(formattedElections);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch elections");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (name, candidates) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axiosInstance.post("/createElection", {
        name,
        candidates: candidates.split(","),
      });
      setMessage(response.data.message);
      fetchAllElections();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create election");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseElection = async (electionId) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axiosInstance.post(`/closeElection/${electionId}`);
      setMessage(response.data.message);
      fetchAllElections();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to close election");
    } finally {
      setLoading(false);
    }
  };

  const handleGetResults = async (electionId) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axiosInstance.get(`/getResults/${electionId}`);
      setElections(elections.map(e => e.id === electionId ? { ...e, results: response.data.results } : e));
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Admin Panel</h1>
      <CreateElection onCreate={handleCreateElection} loading={loading} />
      <ManageElections elections={elections} onClose={handleCloseElection} onGetResults={handleGetResults} loading={loading} />
      <ResultsDisplay elections={elections} />
      {message && <p className="text-center text-lg font-semibold">{message}</p>}
    </div>
  );
};

export default Admin;