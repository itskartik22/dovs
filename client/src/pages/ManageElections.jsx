const ManageElections = ({ elections, onClose, onGetResults, loading }) => {
  return (
    <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Manage Elections</h2>
      {elections.length === 0 ? (
        <p>No Elections Available</p>
      ) : (
        elections.map((election) => (
          <div key={election.id} className="flex justify-between items-center p-2 border-b">
            <p>{election.name}</p>
            <div className="space-x-2">
              <button
                onClick={() => onGetResults(election.id)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                disabled={loading}
              >
                Show Results
              </button>
              {election.isActive && (
                <button
                  onClick={() => onClose(election.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                  disabled={loading}
                >
                  Stop Election
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageElections;
