import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [quizData, setQuizData] = useState(null); // { moduleId, quizId, quizzes }
  const [answers, setAnswers] = useState({}); // { questionIndex: selectedOption }
  const [submittedResult, setSubmittedResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/auth/isloggedin", {
          withCredentials: true,
        });
        if (res.status !== 200 || !res.data.success) {
          navigate("/student-login", { replace: true });
        }
      } catch (err) {
        navigate("/student-login", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/modules", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch modules");

        const data = await res.json();
        setModules(data);
      } catch (err) {
        console.error("Error fetching modules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // handle quiz generation
  const handleGenerateQuiz = async (moduleId) => {
    try {
      const res = await axios.post(
        `http://localhost:5001/api/quizzes/generate/${moduleId}`,
        { numQuestions: 5 },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setQuizData({
          moduleId,
          quizId: res.data.quizId,
          quizzes: res.data.quizzes || [],
        });
        setAnswers({});
        setSubmittedResult(null);
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
    }
  };

  // handle selecting an answer
  const handleSelect = (questionIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  // handle quiz submission
  const handleSubmitQuiz = async () => {
    if (!quizData?.quizId) return;

    try {
      const formattedAnswers = Object.entries(answers).map(([questionIndex, selected]) => ({
        questionIndex: parseInt(questionIndex, 10),
        selected,
      }));

      const res = await axios.post(
        "http://localhost:5001/api/quizzes/submit",
        {
          quizId: quizData.quizId,
          answers: formattedAnswers,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setSubmittedResult(res.data);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <h1 className="text-4xl font-bold">Learning Modules</h1>
          <p className="text-lg mt-2">Browse and read modules provided by your college.</p>

          {loading ? (
            <h2 className="text-center mt-10 text-lg">Loading modules...</h2>
          ) : modules.length === 0 ? (
            <p className="text-gray-500 mt-6">No modules found.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((m) => (
                <div
                  key={m._id || m.id}
                  className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold">{m.title}</h2>
                  <p className="text-gray-600">Category: {m.category}</p>

                  {m.fileUrl && (
                    <button
                      onClick={() => setPdfUrl(`http://localhost:5001${m.fileUrl}`)}
                      className="mt-2 mr-2 text-white bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
                    >
                      View PDF
                    </button>
                  )}

                  <button
                    onClick={() => handleGenerateQuiz(m._id || m.id)}
                    className="mt-2 text-white bg-green-600 px-4 py-1 rounded hover:bg-green-700"
                  >
                    Generate Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* PDF Popup Modal */}
      {pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 h-5/6 rounded-lg shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-2 border-b">
              <h2 className="font-semibold">Module PDF</h2>
              <button
                onClick={() => setPdfUrl(null)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <iframe
              src={pdfUrl}
              className="flex-1 w-full rounded-b-lg"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}

      {/* Quiz Popup Modal */}
      {quizData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-5/6 rounded-lg shadow-lg flex flex-col p-4 overflow-auto">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="font-semibold text-xl">Generated Quiz</h2>
              <button
                onClick={() => setQuizData(null)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {quizData.quizzes.length === 0 ? (
              <p className="text-gray-600">No quiz available.</p>
            ) : submittedResult ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">Result</h3>
                <p>
                  Score: {submittedResult.score} /{" "}
                  {quizData.quizzes.length}
                </p>
                <p className="text-gray-600 mt-2">
                  {submittedResult.message || "Quiz submitted successfully!"}
                </p>
              </div>
            ) : (
              <div>
                <ul className="space-y-6">
                  {quizData.quizzes.map((q, idx) => (
                    <li key={idx} className="border p-4 rounded-lg bg-gray-50">
                      <p className="font-semibold mb-2">
                        Q{idx + 1}. {q.text}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, i) => (
                          <label key={i} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`question-${idx}`}
                              value={opt}
                              checked={answers[idx] === opt}
                              onChange={() => handleSelect(idx, opt)}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleSubmitQuiz}
                  className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Submit Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
