import { NavLink } from "react-router-dom"
import { useState } from "react"

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
].map(name => ({ name, number: "112" }))

export default function Sidebar() {
    const [open, setOpen] = useState(false)

    const linkClass = (isActive) =>
        `block text-white px-3 py-2 rounded-md font-semibold hover:bg-white/6 ${isActive ? "bg-white/12" : ""}`

    return (
        <aside className="bg-gradient-to-b from-orange-500 to-orange-600 text-white w-60 p-4 min-h-screen box-border">
            <nav className="flex flex-col gap-2">
                <NavLink to="/HomePage" className={({ isActive }) => linkClass(isActive)}> Home</NavLink>
                <NavLink to="/quizzes" className={({ isActive }) => linkClass(isActive)}> Quizzes</NavLink>
                <NavLink to="/modules" className={({ isActive }) => linkClass(isActive)}> Modules</NavLink>

                <div className="mt-2">
                    <button
                        onClick={() => setOpen(v => !v)}
                        className="mt-2 bg-white text-orange-600 px-3 py-2 rounded-md font-bold hover:opacity-95"
                        type="button"
                    >
                        Emergency {open ? "▲" : "▼"}
                    </button>

                    {open && (
                        <div className="mt-2 p-2 bg-white/5 rounded-md max-h-64 overflow-y-auto text-white">
                            {STATES.map(s => (
                                <div key={s.name} className="py-2 border-b border-white/5">
                                    <div className="font-bold">{s.name}</div>
                                    <div className="text-sm opacity-95">{s.number}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <NavLink to="/about" className={({ isActive }) => linkClass(isActive)}>About</NavLink>
            </nav>
        </aside>
    )
}