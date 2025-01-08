import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        alert("Connected to MetaMask!");
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
      <h2 className="text-4xl font-bold text-indigo-900">Welcome to Votify</h2>
      <p className="text-center w-[80%]">
        Please connect your Metamask wallet to continue. If you don&apos;t have one,
        you can install it from{" "}
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
    </div>
  );
};

export default Login;
