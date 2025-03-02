const Voting = () => {
  return (
    <div className="bg-red-200 px-8 items-center flex-col">
      <p className="text-2xl font-bold place-self-center">Bihar Vidhansabha Election 2025</p>
      <div className="font-bold flex justify-between items-center py-2">
        <p>Constituency</p>
        <div className="flex justify-between flex-col items-center text-sm">
          <img
            src="https://www.w3schools.com/w3images/avatar2.png"
            alt="Avatar"
            className="w-12 h-12 rounded-full"
          />
          <p>NAME-Ashwini</p>
          <p>{"Voter Id: 123456"}</p>
        </div>
      </div>
    </div>
  );
};

export default Voting;
