// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/auth/isloggedin", {
          withCredentials: true,
        });
        if (!res.data.success) {
          navigate("/student-login", { replace: true });
        } else {
          setLoading(false);
        }
      } catch (err) {
        navigate("/student-login", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);
  if (loading) return <p className="text-center mt-10">Checking authentication...</p>;
  return children;
}
