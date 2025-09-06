import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api/auth",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
      localStorage.clear();
      sessionStorage.clear();
      navigate("/student-login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <header className="bg-gradient-to-b from-orange-500 to-orange-600 text-white px-4 py-3 flex justify-end items-center gap-3 shadow z-20">
      <nav className="flex items-center gap-3">
        <button
          type="button"
          onClick={logout}
          className="bg-white text-orange-600 font-bold px-3 py-2 rounded-md hover:opacity-95 hover:cursor-pointer"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
