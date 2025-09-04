import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    education: "",
    institution: "",
    age: "",
    email: "",
    phonenumber: "",
    password: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      alert("Student registered successfully!");
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 border-2 border-orange-500">
        <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          Student Sign Up
        </h1>

        {error && (
          <div className="mb-4 text-red-600 font-medium text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "fullName", label: "Full Name", type: "text" },
            { name: "userName", label: "Username", type: "text" },
            { name: "education", label: "Education", type: "text" },
            { name: "institution", label: "Institution", type: "text" },
            { name: "age", label: "Age", type: "number" },
            { name: "email", label: "Email", type: "email" },
            { name: "phonenumber", label: "Phone Number", type: "text" },
            { name: "password", label: "Password", type: "password" },
            { name: "location", label: "Location", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 mb-1 font-medium">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.name !== "age"}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-300"
         
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              className="text-orange-600 hover:underline font-semibold"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
