import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState(null);
  console.log("userAddress", userAddress);
  // Check if MetaMask is already connected on page load
  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          localStorage.setItem("user-address", accounts[0]);
          navigate("/dashboard");
        }
      }
    };
    checkMetaMaskConnection();
  }, [navigate, userAddress]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          alert("Account changed!");
        }
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);
  // Handle MetaMask login
  const handleLogin = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);
        alert("Connected to MetaMask!");
        localStorage.setItem("user-address", accounts[0]);
        navigate("/dashboard");
      } else {
        alert("Please install MetaMask to use this app.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
  };

  return (
    <div className="h-screen flex flex-col space-y-7 justify-center items-center">
      <h2 className="text-4xl font-bold text-indigo-900">Welcome to DOVS</h2>
      <p className="text-center w-[80%]">
        Please connect your Metamask wallet to continue. If you don&apos;t have
        one, you can install it from{" "}
        <a
          href="https://metamask.io/download.html"
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600"
        >
          here
        </a>
        .
      </p>

      <button
        onClick={handleLogin}
        className="py-2 px-4 bg-indigo-600 rounded-2xl text-white font-semibold"
      >
        Connect to Metamask Wallet
      </button>

      {userAddress && (
        <p className="text-sm text-gray-600 mt-4">
          Connected as: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
        </p>
      )}
    </div>
  );
};

export default Login;
