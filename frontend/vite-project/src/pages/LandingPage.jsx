import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
  const images = [
    {
      url: "/src/assets/disaster.jpg",
      alt: "Earthquake damage to buildings",
    },
    {
      url: "https://images.unsplash.com/photo-1574687480055-7ac4042ff4f5?w=400&h=240&fit=crop&crop=center",
      alt: "Wildfire emergency",
    },
    {
      url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=240&fit=crop&crop=center",
      alt: "Flood disaster",
    },
    {
      url: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=240&fit=crop&crop=center",
      alt: "Hurricane approaching",
    },
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=240&fit=crop&crop=center",
      alt: "Emergency supplies kit",
    },
  ];
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex items-center mb-6">
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
        <div className="mb-6 relative overflow-hidden rounded-lg bg-white shadow-lg">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.alt}
                className="w-full h-48 object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentImage ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-right mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Be Disaster Ready, Anytime,
          </h2>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Anywhere!
          </h2>
        </div>
        <div className="space-y-3">
          <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors" onClick={() => navigate("/Option")}>
            GET STARTED
          </button>
          <button className="w-full border border-black text-black py-3 px-6 rounded-lg font-medium transition-colors">
            I ALREADY HAVE AN ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}
