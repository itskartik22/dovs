import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Voting from "./pages/Voting";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results.jsx";
import Admin from "./pages/Admin.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/voting" element={<Voting />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
