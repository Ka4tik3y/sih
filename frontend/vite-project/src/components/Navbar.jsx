import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("auth")
        localStorage.removeItem("token")
        navigate("/student-login")
    }
    return (
        <header className="bg-gradient-to-b from-orange-500 to-orange-600 text-white px-4 py-3 flex justify-end items-center gap-3 shadow z-20">
            <nav className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-white text-orange-600 font-bold px-3 py-2 rounded-md hover:opacity-95 hover:cursor-pointer"
                    
                >
                    Logout
                </button>
            </nav>
        </header>
    )
}