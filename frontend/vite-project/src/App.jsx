import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage.jsx"
import OptionPage from "./pages/OptionPage.jsx"
import SignUpPage from "./pages/SignupPage.jsx"
import LoginPageStaff from "./pages/LoginPageStaff.jsx"
import LoginPageStudent from "./pages/LoginPageStudent.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import HomePage from "./pages/HomePage.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/option" element={<OptionPage />} />
        <Route path="/student-signup" element={<SignUpPage />} />
        <Route path="/admin-login" element={<LoginPageStaff />} />
        <Route path="/student-login" element={<LoginPageStudent />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App
