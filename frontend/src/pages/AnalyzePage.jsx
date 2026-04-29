// src/pages/AnalyzePage.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const API_URL     = import.meta.env.VITE_API_URL || "http://localhost:5000";
const MAX_MB      = 100;
const ALLOWED_EXT = [".mp4", ".avi", ".mov"];
const ALLOWED_MIME= ["video/mp4","video/avi","video/quicktime","video/x-msvideo"];

const STEPS = [
  "Uploading video securely…",
  "Extracting video frames…",
  "Running AI deepfake detection…",
  "Calculating confidence score…",
  "Preparing your result…",
];

export default function AnalyzePage() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [file,     setFile]     = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [status,   setStatus]   = useState("idle"); // idle|loading|result|error
  const [result,   setResult]   = useState(null);
  const [errMsg,   setErrMsg]   = useState("");
  const [step,     setStep]     = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  // Cycle loading steps
  useEffect(() => {
    if (status !== "loading") { setStep(0); return; }
    const t = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 1800);
    return () => clearInterval(t);
  }, [status]);

  // Animate confidence bar
  useEffect(() => {
    if (status === "result" && result) setTimeout(() => setBarWidth(displayConfidence(result)), 150);
    else setBarWidth(0);
  }, [status, result]);

  const validate = (f) => {
    if (!f) return "No file selected.";
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXT.includes(ext) && !ALLOWED_MIME.includes(f.type))
      return "Unsupported format. Use MP4, AVI, or MOV.";
    if (f.size > MAX_MB * 1024 * 1024)
      return `File too large. Max ${MAX_MB}MB allowed.`;
    return null;
  };

  const pickFile = (f) => {
    const err = validate(f);
    if (err) { setErrMsg(err); setFile(null); return; }
    setErrMsg(""); setFile(f); setStatus("idle"); setResult(null);
  };

  const analyze = async () => {
    if (!file) return;
    setStatus("loading"); setErrMsg(""); setResult(null);
    try {
      const token = await getToken();
      const form  = new FormData();
      form.append("video", file);

      const res = await axios.post(`${API_URL}/api/analyze`, form, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      // Backend now saves to MongoDB — no localStorage needed
      const r = {
        label:      res.data.label,
        confidence: res.data.confidence,
        filename:   file.name,
        timestamp:  res.data.analyzedAt || new Date().toISOString(),
        recordId:   res.data.recordId,
      };

      setResult(r);
      setStatus("result");

    } catch (e) {
      setStatus("error");
      if (e.response?.status === 401)    setErrMsg("Session expired. Please sign in again.");
      else if (e.response?.status === 413) setErrMsg("File is too large for the server.");
      else if (e.response?.status === 503) setErrMsg("AI service is currently offline. Please try again later.");
      else if (e.response?.status === 504) setErrMsg("Analysis timed out. Try a shorter video clip.");
      else if (e.code === "ECONNABORTED")  setErrMsg("Request timed out. The server may be busy.");
      else setErrMsg(e.response?.data?.error || e.response?.data?.detail || "Analysis failed. Please try again.");
    }
  };

  const reset = () => {
    setStatus("idle"); setFile(null); setResult(null); setErrMsg("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const fmtSize = (b) => b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`;
  const isFake  = result?.label === "FAKE";
  const displayConfidence = (r) => r?.label === "FAKE" ? parseFloat((100 - r.confidence).toFixed(1)) : r?.confidence;

  return (
    <>
      <div className="relative z-10 min-h-screen max-w-[860px] mx-auto px-6 pt-[100px] pb-16">

        {/* Page header */}
        <div className="mb-10" style={{ animation: "fadeUp 0.4s ease both" }}>
          <button onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 mb-5 text-sm text-[#64748b] cursor-pointer transition-all hover:text-[#a5b4fc] group"
            style={{ background: "none", border: "none", padding: 0 }}>
            <span className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:-translate-x-0.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
              </svg>
            </span>
            Back to Home
          </button>
          <h1 className="font-cabinet font-black text-white mb-2" style={{ fontSize: "clamp(2rem,4vw,2.8rem)", letterSpacing: "-1.5px" }}>
            Analyze <span className="gradient-text">Video</span>
          </h1>
          <p className="text-[#94a3b8] text-[0.95rem]">Upload a video to detect if it contains deepfake manipulation.</p>
        </div>

        {/* ── IDLE / ERROR ── */}
        {(status === "idle" || status === "error") && (
          <>
            {/* Upload zone */}
            <div
              className={`upload-zone${dragOver ? " drag-over" : ""}`}
              style={{ animation: "fadeUp 0.4s ease 0.1s both" }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if(f) pickFile(f); }}
            >
              <input ref={fileRef} type="file" accept=".mp4,.avi,.mov,video/*" className="hidden"
                onChange={e => { if(e.target.files[0]) pickFile(e.target.files[0]); }} />
              <div className="w-16 h-16 rounded-[18px] flex items-center justify-center text-3xl mx-auto mb-5 transition-transform"
                style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                📹
              </div>
              <h3 className="font-cabinet font-extrabold text-white text-xl mb-2">Drop your video here</h3>
              <p className="text-[#94a3b8] text-sm">or <span className="text-[#a5b4fc] underline cursor-pointer">browse to upload</span></p>
              <div className="flex gap-2 justify-center mt-4 flex-wrap">
                {["MP4","AVI","MOV","MAX 100MB"].map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-wider text-[#a5b4fc]"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* File selected card */}
            {file && (
              <div className="flex items-center gap-3.5 mt-5 p-[18px] rounded-[14px]"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", animation: "fadeUp 0.3s ease" }}>
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "rgba(99,102,241,0.15)" }}>🎬</div>
                <div className="flex-1 min-w-0">
                  <div className="font-cabinet font-bold text-white text-[0.9rem] truncate">{file.name}</div>
                  <div className="text-xs text-[#64748b] mt-0.5">{fmtSize(file.size)}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); reset(); }}
                  className="text-xs text-[#fca5a5] px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:bg-[rgba(239,68,68,0.2)] flex-shrink-0"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  Remove
                </button>
              </div>
            )}

            {/* Error */}
            {errMsg && (
              <div className="mt-3 px-[18px] py-3 rounded-xl text-sm text-[#f87171]"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                ⚠ {errMsg}
              </div>
            )}

            {/* Analyze button */}
            <button
              onClick={analyze} disabled={!file || !!errMsg}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-[14px] border-none text-white font-cabinet font-extrabold text-base cursor-pointer mt-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 6px 24px rgba(99,102,241,0.4)", animation: "fadeUp 0.4s ease 0.2s both" }}
              onMouseOver={e => { if(!e.currentTarget.disabled) e.currentTarget.style.boxShadow="0 10px 32px rgba(99,102,241,0.55)"; }}
              onMouseOut={e  => e.currentTarget.style.boxShadow="0 6px 24px rgba(99,102,241,0.4)"}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.3 24.3 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.703-1.31 2.703H4.11c-1.34 0-2.31-1.703-1.31-2.703L4.2 15.3"/>
              </svg>
              {file ? "Analyze Video for Deepfakes" : "Select a Video First"}
            </button>
          </>
        )}

        {/* ── LOADING ── */}
        {status === "loading" && (
          <div className="mt-6 rounded-[20px] p-12 text-center" style={{ background: "#0d1120", border: "1px solid rgba(255,255,255,0.07)", animation: "fadeUp 0.4s ease" }}>
            <div className="spinner" />
            <div className="font-cabinet font-extrabold text-white text-xl mb-2">Analyzing your video…</div>
            <div className="text-[#94a3b8] text-sm mb-6">Our AI model is scanning every frame</div>
            <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
              {STEPS.map((s, i) => (
                <div key={i} className={`flex items-center gap-2.5 text-xs px-3 py-2 rounded-lg transition-all ${i <= step ? "text-[#a5b4fc]" : "text-[#64748b]"}`}
                  style={{ background: i <= step ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.02)" }}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i <= step ? "bg-[#6366f1] shadow-[0_0_8px_#6366f1] animate-[pulseDot_1.2s_infinite]" : "bg-[#64748b]"}`} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {status === "result" && result && (
          <>
            <div className={`mt-6 rounded-[20px] p-10 text-center ${isFake
              ? "bg-[linear-gradient(135deg,rgba(239,68,68,0.1),rgba(220,38,38,0.05))]"
              : "bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.05))]"}`}
              style={{ border: `1px solid ${isFake ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`, animation: "fadeUp 0.5s ease" }}>

              <div className="text-5xl mb-3">{isFake ? "🚨" : "✅"}</div>
              <div className="font-cabinet font-black mb-2"
                style={{ fontSize: "4rem", letterSpacing: "-2px", color: isFake ? "#f87171" : "#34d399" }}>
                {result.label}
              </div>
              <div className="text-[#94a3b8] text-lg mb-6">
                {isFake ? "Fake Probability: " : "True Probability: "}
                <strong className="text-white">{displayConfidence(result).toFixed(1)}%</strong>
              </div>

              {/* Confidence bar */}
              <div className="h-1.5 rounded-full max-w-xs mx-auto mb-8 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full transition-all duration-[1500ms] ease-out"
                  style={{ width: `${barWidth}%`, background: isFake ? "linear-gradient(90deg,#ef4444,#f87171)" : "linear-gradient(90deg,#10b981,#34d399)" }} />
              </div>

              {/* Meta chips */}
              <div className="flex gap-4 justify-center flex-wrap mb-7">
                {[
                  `📁 ${result.filename}`,
                  `🕐 ${new Date(result.timestamp).toLocaleString()}`,
                  isFake ? "⚠ Deepfake Detected" : "✓ Appears Authentic",
                ].map((t, i) => (
                  <div key={i} className="px-4 py-2 rounded-lg text-xs text-[#94a3b8]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>{t}</div>
                ))}
              </div>

              {/* View in history button */}
              <button onClick={() => navigate("/history")}
                className="inline-flex items-center gap-2 mr-3 px-5 py-2.5 rounded-xl text-[0.875rem] text-[#a5b4fc] cursor-pointer transition-all hover:text-white"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
                📋 View in History
              </button>
            </div>

            <button onClick={reset}
              className="inline-flex items-center gap-2 mt-4 px-7 py-3 rounded-xl text-[0.875rem] text-[#a5b4fc] cursor-pointer transition-all hover:text-white hover:bg-[rgba(99,102,241,0.2)]"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
              ↩ Analyze Another Video
            </button>
          </>
        )}

        {/* Disclaimer */}
        <div className="mt-6 px-[18px] py-3.5 rounded-xl text-xs text-[#fcd34d] leading-relaxed"
          style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", animation: "fadeUp 0.4s ease 0.3s both" }}>
          ⚠️ <strong>Disclaimer:</strong> This system uses an AI-based deepfake detection model.
          Results are not guaranteed to be 100% accurate and are intended for educational and
          research purposes only. Do not use as sole evidence in any legal or formal decision.
        </div>
      </div>
      <Footer />
    </>
  );
}