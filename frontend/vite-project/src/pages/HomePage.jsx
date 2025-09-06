import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertsHub from "../components/AlertsHub.jsx";

const SAMPLE_NEWS = [
  { title: "Flood alert in low-lying areas", date: "2025-09-05", body: "Heavy rains expected for the next 48 hours..." },
  { title: "Heatwave advisory issued", date: "2025-09-04", body: "Temperatures to remain high this week..." },
  { title: "Cyclone watch on the coast", date: "2025-09-03", body: "A low pressure system may intensify near the coast..." },
];
const DISASTER_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=1000&q=80", alt: "Flood", title: "Emergency Response", description: "Rapid disaster relief across India" },
  { src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1000&q=80", alt: "Rescue", title: "Rescue Operations", description: "Saving lives in critical situations" },
  { src: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=1000&q=80", alt: "Medical", title: "Medical Aid", description: "Providing healthcare in disaster zones" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80", alt: "Food", title: "Food Distribution", description: "Ensuring no one goes hungry" },
];
const ALERTS = [
  { name: "Cyclone", icon: "/icons/cyclone.png", route: "/alerts/cyclone" },
  { name: "Rainfall", icon: "/icons/rainfall.png", route: "/alerts/rainfall" },
  { name: "Flood", icon: "/icons/flood.png", route: "/alerts/flood" },
  { name: "Earthquake", icon: "/icons/earthquake.png", route: "/alerts/earthquake" },
  { name: "Tsunami", icon: "/icons/tsunami.png", route: "/alerts/tsunami" },
  { name: "Landslide", icon: "/icons/landslide.png", route: "/alerts/landslide" },
  { name: "Avalanche", icon: "/icons/avalanche.png", route: "/alerts/avalanche" },
  { name: "Drought", icon: "/icons/drought.png", route: "/alerts/drought" },
  { name: "Thunderstorm", icon: "/icons/thunderstorm.png", route: "/alerts/thunderstorm" },
  { name: "Wildfire", icon: "/icons/wildfire.png", route: "/alerts/wildfire" },
];
export default function HomePage() {
  const [newsIndex, setNewsIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const newsCount = SAMPLE_NEWS.length;
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/auth/isloggedin", { withCredentials: true });
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
    const id = setInterval(() => setNewsIndex((i) => (i + 1) % newsCount), 5000);
    return () => clearInterval(id);
  }, [newsCount]);
  useEffect(() => {
    const id = setInterval(() => setPhotoIndex((i) => (i + 1) % DISASTER_PHOTOS.length), 4000);
    return () => clearInterval(id);
  }, []);
  const current = SAMPLE_NEWS[newsIndex];
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <h1 className="text-4xl font-bold">Welcome, Student</h1>
          <p className="text-lg mt-2">Access quizzes, modules and emergency info from the left.</p>
          <section className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold">{current.title}</h2>
            <p className="text-sm text-gray-500">{current.date}</p>
            <p className="mt-4 text-gray-700">{current.body}</p>
          </section>
          <section className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={DISASTER_PHOTOS[photoIndex].src}
              alt={DISASTER_PHOTOS[photoIndex].alt}
              className="w-full h-64 object-cover"
            />
            <div className="p-4 text-center text-gray-800">
              <h3 className="font-bold">{DISASTER_PHOTOS[photoIndex].title}</h3>
              <p>{DISASTER_PHOTOS[photoIndex].description}</p>
            </div>
          </section>
          <AlertsHub />
        </main>
      </div>
    </div>
  );
}
