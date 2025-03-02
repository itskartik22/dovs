const ResultsDisplay = ({ elections }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Election Results</h2>
      {elections.map(
        (election) =>
          election.results && (
            <div key={election.id} className="p-4 border rounded">
              <h3>{election.name}</h3>
              {election.results.candidates.map((candidate, index) => (
                <p key={index}>
                  {candidate.name}: {candidate.votes} votes
                </p>
              ))}
            </div>
          )
      )}
    </div>
  );
};

export default ResultsDisplay;
