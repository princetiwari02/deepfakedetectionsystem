// src/components/AuthModal.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function AuthModal({ initialMode, onClose }) {
  const [mode,     setMode]     = useState(initialMode);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [busy,     setBusy]     = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose(); };

  const fmtError = (code) => {
    const map = {
      "auth/user-not-found":       "No account found with that email.",
      "auth/wrong-password":       "Incorrect password.",
      "auth/email-already-in-use": "That email is already registered.",
      "auth/weak-password":        "Password must be at least 6 characters.",
      "auth/invalid-email":        "Please enter a valid email address.",
      "auth/too-many-requests":    "Too many attempts. Please wait a moment.",
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    };
    return map[code] || "Something went wrong. Please try again.";
  };

  const submit = async () => {
    setError(""); setBusy(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) { setError("Please enter your full name."); setBusy(false); return; }
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
      onClose();
      navigate("/");
    } catch (e) { setError(fmtError(e.code)); }
    finally { setBusy(false); }
  };

  const googleLogin = async () => {
    setError(""); setBusy(true);
    try { await loginWithGoogle(); onClose(); navigate("/"); }
    catch (e) { setError(fmtError(e.code)); }
    finally { setBusy(false); }
  };

  const switchMode = (m) => { setMode(m); setError(""); };
  const onKey = (e) => { if (e.key === "Enter") submit(); };

  const FieldLabel = ({ children }) => (
    <label className="block text-xs text-[#94a3b8] font-medium mb-1.5">{children}</label>
  );

  return (
    <div
      onClick={handleOverlay}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
    >
      <style>{`
        /* Running border keyframe */
        @keyframes runBorder {
          0%   { background-position: 0% 0%; }
          100% { background-position: 400% 0%; }
        }

        /* Wrapper for the running border effect */
        .auth-modal-wrap {
          position: relative;
          border-radius: 24px;
          padding: 2px; /* space for the border */
          background: rgba(255,255,255,0.08);
          transition: background 0.3s ease;
        }

        /* The animated gradient border — hidden by default */
        .auth-modal-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            transparent 30%,
            #22d3ee 50%,
            #6366f1 60%,
            #a855f7 70%,
            transparent 90%,
            transparent 100%
          );
          background-size: 300% 100%;
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        /* On hover: show running border */
        .auth-modal-wrap:hover::before {
          opacity: 1;
          animation: runBorder 2s linear infinite;
        }

        /* Inner card sits inside the wrapper */
        .auth-modal-inner {
          border-radius: 22px;
          background: #0d1120;
          position: relative;
          z-index: 1;
        }

        /* Also glow the box-shadow on hover */
        .auth-modal-wrap:hover .auth-modal-inner {
          box-shadow:
            0 0 40px rgba(34,211,238,0.12),
            0 0 80px rgba(99,102,241,0.1);
        }
      `}</style>

      <div className="auth-modal-wrap w-full max-w-[420px]" style={{ animation: "fadeUp 0.3s ease" }}>
        <div className="auth-modal-inner p-10">

          {/* Close button */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] cursor-pointer transition-all hover:text-white text-base z-10"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>✕</button>

          {/* Brand */}
          <div className="flex items-center gap-2 mb-1.5 font-cabinet font-extrabold text-white text-base">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] shadow-[0_0_14px_#22d3ee] animate-[pulseDot_2s_ease-in-out_infinite]" />
            DeepGuard AI
          </div>

          {mode === "login" ? (
            <>
              <h2 className="font-cabinet font-black text-[1.7rem] text-white tracking-tight mb-1">Welcome back</h2>
              <p className="text-[#94a3b8] text-sm mb-7">Sign in to continue to DeepGuard AI</p>
              <div className="mb-3.5">
                <FieldLabel>Email address</FieldLabel>
                <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={onKey} />
              </div>
              <div className="mb-3.5">
                <FieldLabel>Password</FieldLabel>
                <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={onKey} />
              </div>
            </>
          ) : (
            <>
              <h2 className="font-cabinet font-black text-[1.7rem] text-white tracking-tight mb-1">Create account</h2>
              <p className="text-[#94a3b8] text-sm mb-7">Join DeepGuard AI for free</p>
              <div className="mb-3.5">
                <FieldLabel>Full name</FieldLabel>
                <input type="text" className="form-input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} onKeyDown={onKey} />
              </div>
              <div className="mb-3.5">
                <FieldLabel>Email address</FieldLabel>
                <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={onKey} />
              </div>
              <div className="mb-3.5">
                <FieldLabel>Password</FieldLabel>
                <input type="password" className="form-input" placeholder="Min. 6 characters" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={onKey} />
              </div>
            </>
          )}

          {error && (
            <div className="text-[#f87171] text-xs mt-2 px-3.5 py-2.5 rounded-lg"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <button onClick={submit} disabled={busy}
            className="w-full py-[13px] rounded-xl border-none text-white font-cabinet font-extrabold text-[0.95rem] cursor-pointer mt-2.5 transition-all hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
            {busy ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div className="flex items-center gap-3 my-[18px]">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-xs text-[#64748b]">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          <button onClick={googleLogin} disabled={busy}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm text-[#f1f5f9] cursor-pointer transition-all disabled:opacity-60"
            style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseOver={e=>e.currentTarget.style.borderColor="rgba(99,102,241,0.4)"}
            onMouseOut={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>
            <GoogleIcon /> Continue with Google
          </button>

          <p className="text-center text-xs text-[#64748b] mt-[18px]">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <a className="text-[#22d3ee] cursor-pointer" onClick={()=>switchMode(mode==="login"?"signup":"login")}>
              {mode === "login" ? "Create one →" : "Sign in →"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}