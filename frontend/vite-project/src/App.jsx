import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage.jsx"
import OptionPage from "./pages/OptionPage.jsx"
import SignUpPage from "./pages/SignupPage.jsx"
import LoginPageStaff from "./pages/LoginPageStaff.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/option" element={<OptionPage />} />
        <Route path="/student-signup" element={<SignUpPage />} />
        <Route path="/admin-login" element={<LoginPageStaff />} />
  <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App
