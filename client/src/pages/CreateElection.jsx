import { useState } from "react";

const CreateElection = ({ onCreate, loading }) => {
  const [name, setName] = useState("");
  const [candidates, setCandidates] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && candidates) {
      onCreate(name, candidates);
      setName("");
      setCandidates("");
    }
  };

  return (
    <div className="bg-blue-100 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Election</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Election Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Candidates (comma separated)"
          value={candidates}
          onChange={(e) => setCandidates(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Election"}
        </button>
      </form>
    </div>
  );
};

export default CreateElection;
