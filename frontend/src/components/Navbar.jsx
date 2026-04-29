// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onOpenModal }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initials    = user?.displayName ? user.displayName.slice(0,2).toUpperCase() : user?.email?.slice(0,2).toUpperCase() ?? "ME";
  const displayName = user?.displayName || user?.email || "";

  const scrollToHowItWorks = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[60px] max-sm:px-5 h-[72px] bg-[rgba(5,7,15,0.75)] backdrop-blur-2xl border-b border-white/5">
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] shadow-[0_0_14px_#22d3ee] animate-[pulseDot_2s_ease-in-out_infinite] flex-shrink-0" />
        <span className="font-cabinet font-black text-[1.3rem] text-white">
          DeepGuard <span className="text-[#22d3ee] ml-0.5">AI</span>
        </span>
      </Link>

      {/* Center nav links */}
      <div className="hidden md:flex items-center gap-6">
        <button
          onClick={scrollToHowItWorks}
          className="text-sm text-[#94a3b8] hover:text-white transition-colors cursor-pointer font-dm"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          How It Works
        </button>
        <Link to="/about" className="text-sm text-[#94a3b8] hover:text-white transition-colors no-underline font-dm">
          About Us
        </Link>
        <Link to="/contact" className="text-sm text-[#94a3b8] hover:text-white transition-colors no-underline font-dm">
          Contact Us
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <button onClick={() => onOpenModal("login")}
              className="px-5 py-2.5 rounded-[10px] text-sm font-semibold cursor-pointer border-none transition-all hover:-translate-y-px font-dm"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}>
              Sign In
            </button>
            <button onClick={() => onOpenModal("signup")}
              className="px-6 py-2.5 rounded-[10px] text-sm font-semibold text-white cursor-pointer border-none transition-all hover:-translate-y-px font-dm"
              style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}>
              Sign Up
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 bg-[#111827] border border-white/[0.06] rounded-full py-[5px] pr-[14px] pl-[6px]">
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-cabinet font-bold text-[0.7rem] text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>{initials}</div>
              <span className="text-[0.82rem] text-[#94a3b8] hidden sm:block max-w-[120px] truncate">{displayName}</span>
            </div>
            <button onClick={() => navigate("/analyze")} className="btn-nav-primary">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
              Analyze Video
            </button>
            <button onClick={() => navigate("/history")} className="btn-nav-cyan">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              My History
            </button>
            <button onClick={() => { logout(); navigate("/"); }} className="btn-nav-red">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/></svg>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}