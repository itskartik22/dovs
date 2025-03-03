"use client"
import {useEffect, useState} from "react";
// import {useNavigate} from "react-router-dom";
import CastVote from "./CastVote.jsx";

const Dashboard = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [voterId, setVoterId] = useState(null);
  const handleToggle = () => {
    setShowPopup(!showPopup);
    console.log(voterId);
  }

  useEffect(() => {
    const storedAddress = localStorage.getItem("user-address");
    const storedVoterId = localStorage.getItem("stored-VoterId");
    if (storedVoterId) {
      setVoterId(storedVoterId)
      setShowPopup(false);
    }
    if (storedAddress) {
      setUserAddress(storedAddress);
    }
  }, []);

  const handleDisconnect = () => {
    localStorage.removeItem("user-address");
    localStorage.removeItem("stored-VoterId");

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
    <div className = "h-screen flex flex-col items-center space-y-7 py-8" >
      {userAddress ? (
        <div className = "h-screen flex flex-col items-center space-y-7 py-8" >
          <h2 className = "text-4xl font-bold text-indigo-900" >Dashboard</h2 >

          {userAddress ? (
            <div className = "text-lg text-gray-800 flex flex-col gap-2 items-center" >
              <p >
                {/*Connected Wallet Address: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}*/}
                Connected Wallet Address: {userAddress}
              </p >
              <button
                onClick = {handleDisconnect}
                className = "mt-2 py-2 px-4 bg-red-600 text-white rounded-md"
              >
                Disconnect Wallet
              </button >
            </div >
          ) : (
            <p className = "text-red-500" >
              Please connect your wallet to access the dashboard.
            </p >
          )}

          {showPopup ? (
            <div className = {`flex items-center justify-center gap-2`} >
              <input
                type = "number"
                onChange = {(e) => {
                  setVoterId(e.target.value)

                }}
                value = {voterId}
                className = {`mt-2 py-2 px-4 bg-amber-200`}
              />
              <button className = {`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
                      onClick = {() => {
                        handleToggle()
                        localStorage.setItem("stored-VoterId", voterId)
                      }} >Confirm
              </button >
            </div >
          ) : (
            <div className={`flex flex-col items-center justify-center gap-2`} >
              <button onClick = {handleToggle} className = {`mt-2 py-2 px-4 bg-red-600 text-white rounded-md`} >Change VoterID
              </button >
              <CastVote voterId = {voterId} />
            </div >
          )}

        </div >
      ) : (
        <div >
          <p className = "text-red-500" >
            Please connect your wallet to access the dashboard.
          </p >
        </div >
      )
      }
    </div >
  );
};

export default Dashboard;
