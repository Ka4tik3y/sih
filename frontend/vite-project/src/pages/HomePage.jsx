import { useEffect, useState } from "react"
import Navbar from "../components/Navbar.jsx"
import Sidebar from "../components/Sidebar.jsx"
import { Link } from "react-router-dom";

const SAMPLE_NEWS = [
    {
        title: "Flood alert in low-lying areas",
        date: "2025-09-05",
        body: "Heavy rains expected for the next 48 hours. Residents in low-lying areas are advised to move to safer ground and follow local authority instructions.",
    },
    {
        title: "Heatwave advisory issued",
        date: "2025-09-04",
        body: "Temperatures to remain high this week. Stay hydrated, avoid outdoor work during peak hours and check on elderly neighbours.",
    },
    {
        title: "Cyclone watch on the coast",
        date: "2025-09-03",
        body: "A low pressure system may intensify near the coast. Fishermen warned not to venture into the sea and ports are advised to follow official updates.",
    },
]

const DISASTER_PHOTOS = [
    {
        src: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        alt: "Disaster Relief - Flood Response",
        title: "Emergency Response",
        description: "Rapid disaster relief across India"
    },
    {
        src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        alt: "Disaster Relief - Rescue Operations",
        title: "Rescue Operations",
        description: "Saving lives in critical situations"
    },
    {
        src: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        alt: "Disaster Relief - Medical Aid",
        title: "Medical Aid",
        description: "Providing healthcare in disaster zones"
    },
    {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        alt: "Disaster Relief - Food Distribution",
        title: "Food Distribution",
        description: "Ensuring no one goes hungry"
    }
]

export default function HomePage() {
    const [newsIndex, setNewsIndex] = useState(0)
    const newsCount = SAMPLE_NEWS.length

    useEffect(() => {
        const id = setInterval(() => setNewsIndex((i) => (i + 1) % newsCount), 5000)
        return () => clearInterval(id)
    }, [newsCount])

    // Auto-slide disaster photos
    useEffect(() => {
        const id = setInterval(() => setPhotoIndex((i) => (i + 1) % DISASTER_PHOTOS.length), 4000)
        return () => clearInterval(id)
    }, [])

    const jumpTo = (i) => setNewsIndex(i)

    // donation state
    const [amount, setAmount] = useState("500")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    // disaster photos carousel state
    const [photoIndex, setPhotoIndex] = useState(0)

    const handleDonate = async (e) => {
        e.preventDefault()
        setMessage("")
        const numeric = Number(amount)
        if (!numeric || numeric <= 0) {
            setMessage("Please enter a valid amount.")
            return
        }
        setLoading(true)
        try {
            // Replace with real payment endpoint
            const res = await fetch("/api/donate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cause: "Dubta Punjab Flood", amount: numeric }),
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                setMessage(err.message || `Donation failed (${res.status})`)
            } else {
                setMessage("Thank you — your donation is received.")
            }
        } catch (err) {
            console.error(err)
            setMessage("Network error. Try again later.")
        } finally {
            setLoading(false)
        }
    }

    const current = SAMPLE_NEWS[newsIndex]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar />
            
            {/* Floating Khalsa Aid Donation Banner */}
            <div className="floating-banner fixed top-20 right-4 z-50 bg-white text-gray-800 rounded-lg shadow-2xl p-4 max-w-sm animate-pulse hover:animate-none transition-all duration-300 hidden md:block border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">All India Disaster Relief</h4>
                        <p className="text-xs opacity-90 mb-2">Support BDRF's emergency response</p>
                        <a 
                            href="https://bdrf.in" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-orange-600 transition-colors"
                        >
                            Donate Now →
                        </a>
                    </div>
                    <button 
                        onClick={() => {
                            const banner = document.querySelector('.floating-banner');
                            if (banner) banner.style.display = 'none';
                        }}
                        className="ml-2 text-gray-600 hover:text-gray-800 text-lg leading-none"
                        aria-label="Close banner"
                    >
                        ×
                    </button>
                </div>
            </div>
            
            {/* Mobile Floating Banner */}
            <div className="floating-banner-mobile fixed bottom-4 left-4 right-4 z-50 bg-white text-gray-800 rounded-lg shadow-2xl p-3 md:hidden border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">All India Disaster Relief</h4>
                        <p className="text-xs opacity-90">Support BDRF's emergency response</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a 
                            href="https://bdrf.in" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-orange-600 transition-colors"
                        >
                            Donate →
                        </a>
                        <button 
                            onClick={() => {
                                const banner = document.querySelector('.floating-banner-mobile');
                                if (banner) banner.style.display = 'none';
                            }}
                            className="text-gray-600 hover:text-gray-800 text-lg leading-none"
                            aria-label="Close banner"
                        >
                            ×
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 md:p-8 overflow-auto">

                    {/* Header with Welcome + Weather */}
                    <header className="max-w-5xl mx-auto mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                            {/* Left: Welcome section */}
                            <div className="md:col-span-2">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                                    Welcome, Student
                                </h1>
                                <p className="mt-2 text-lg text-gray-700">
                                    Access quizzes, modules and emergency info from the left.
                                </p>
                            </div>

                            {/* Right: Weather Section placeholder */}
                            <div className="bg-white rounded-2xl shadow-md p-4 md:col-span-1">
                                <h2 className="text-lg font-bold text-gray-900">Live Weather</h2>
                                <p className="mt-2 text-gray-600 text-sm">
                                    Weather data will appear here.
                                </p>
                                {/* Later replace with Weather API widget */}
                            </div>
                        </div>
                    </header>

                    {/* News + Donation layout */}
                    <section className="max-w-5xl mx-auto mt-8 grid grid-cols-1 gap-8">

                        {/* News card */}
                        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                <div className="flex-1">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {current.title}
                                    </h2>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {current.date}
                                    </div>
                                    <p className="mt-4 text-lg md:text-xl text-gray-700 leading-relaxed">
                                        {current.body}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {SAMPLE_NEWS.map((n, i) => (
                                        <button
                                            key={n.title}
                                            onClick={() => jumpTo(i)}
                                            aria-label={`Show news ${i + 1}`}
                                            className={`w-3 h-3 rounded-full ${i === newsIndex
                                                    ? "bg-orange-500"
                                                    : "bg-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="ml-auto text-sm text-gray-500">
                                    Auto-advances every 5s
                                </div>
                            </div>
                        </div>

                        {/* All India Disaster Relief Section with Photo Carousel */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Left: Donation Box */}
                            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        All India Disaster Relief
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Support disaster relief efforts across India
                                    </p>
                                    
                                    <a
                                        href="https://bdrf.in"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200"
                                    >
                                        Donate Now
                                    </a>
                                    
                                    <p className="mt-3 text-xs text-gray-500">
                                        Powered by <a href="https://bdrf.in" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">BDRF</a>
                                    </p>
                                </div>
                            </div>

                            {/* Right: Disaster Photos Carousel */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="relative h-64 md:h-full">
                                    <img
                                        src={DISASTER_PHOTOS[photoIndex].src}
                                        alt={DISASTER_PHOTOS[photoIndex].alt}
                                        className="w-full h-full object-cover transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <h4 className="text-lg font-bold mb-2">{DISASTER_PHOTOS[photoIndex].title}</h4>
                                            <p className="text-sm">{DISASTER_PHOTOS[photoIndex].description}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Navigation dots */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {DISASTER_PHOTOS.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setPhotoIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-colors ${
                                                    index === photoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                                }`}
                                                aria-label={`Go to photo ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}