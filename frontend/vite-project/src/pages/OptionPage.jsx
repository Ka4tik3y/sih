import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OptionPage() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const handleStudentClick = () => {
    setSelectedOption("student");
    console.log("Navigate to student sign up");
  };
  const handleAdminClick = () => {
    setSelectedOption("admin");
    console.log("Navigate to admin login");
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex items-center justify-center mb-8">
          <div className="w-8 h-8 bg-orange-500 rounded mr-3 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-orange-600">DisasterReady</h1>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-500">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Which one are you?
            </h2>
            <div className="w-16 h-0.5 bg-orange-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleStudentClick}
              className={`p-6 border-2 rounded-lg transition-all duration-200 ${selectedOption === "student"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-3 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9L12 3zm2.82 12.18L12 16.72l-2.82-1.54V12L12 13.54L15.82 12v3.18z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-800">STUDENT</span>
              </div>
            </button>
            <button
              onClick={handleAdminClick}
              className={`p-6 border-2 rounded-lg transition-all duration-200 ${selectedOption === "admin"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-3 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L19 6V4C19 2.9 18.1 2 17 2H7C5.9 2 5 2.9 5 4V6L3 7V9L5 8V18C5 19.1 5.9 20 7 20H17C18.1 20 19 19.1 19 18V8L21 9ZM17 8V18H15V12H9V18H7V8H17ZM19.5 15.5L18 14L16.5 15.5L18 17L19.5 15.5Z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-800">ADMIN</span>
              </div>
            </button>
          </div>
          {selectedOption === "student" ? (
            <div className="space-y-3">
              <button
                className="w-full py-3 px-6 rounded-lg font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                onClick={() => navigate("/student-login")}
              >
                LOGIN
              </button>
              <button
                className="w-full py-3 px-6 rounded-lg font-semibold border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors"
                onClick={() => navigate("/student-signup")}
              >
                SIGN UP
              </button>
            </div>
          ) : selectedOption === "admin" ? (
            <button
              className="w-full py-3 px-6 rounded-lg font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              onClick={() => navigate("/admin-login")}
            >
              ADMIN LOGIN
            </button>
          ) : (
            <button
              className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
              disabled
            >
              SELECT AN OPTION
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
