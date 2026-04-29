// src/pages/HistoryPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function HistoryPage() {
  const { getToken, user } = useAuth();
  const navigate = useNavigate();

  const [history,  setHistory]  = useState([]);
  const [stats,    setStats]    = useState({ total: 0, fakeCount: 0, realCount: 0, avgConfidence: 0 });
  const [loading,  setLoading]  = useState(true);
  const [errMsg,   setErrMsg]   = useState("");
  const [deleting, setDeleting] = useState(null); // id of record being deleted

  // ── Fetch history + stats from MongoDB API ──────────────────────
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setErrMsg("");
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [histRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/history?limit=50`, { headers }),
        axios.get(`${API_URL}/api/history/stats`,    { headers }),
      ]);

      setHistory(histRes.data.analyses || []);
      setStats(statsRes.data);
    } catch (e) {
      console.error("History fetch error:", e);
      if (e.response?.status === 401) {
        setErrMsg("Session expired. Please sign in again.");
      } else {
        setErrMsg("Failed to load history. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Delete a single record ──────────────────────────────────────
  const deleteOne = async (id) => {
    if (!confirm("Delete this analysis record?")) return;
    setDeleting(id);
    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(prev => prev.filter(h => h._id !== id));
      setStats(prev => {
        const item = history.find(h => h._id === id);
        return {
          ...prev,
          total:     prev.total - 1,
          fakeCount: prev.fakeCount - (item?.label === "FAKE" ? 1 : 0),
          realCount: prev.realCount - (item?.label === "REAL" ? 1 : 0),
        };
      });
    } catch (e) {
      alert("Failed to delete record. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  // ── Clear all records ───────────────────────────────────────────
  const clearAll = async () => {
    if (!confirm("Clear all history? This cannot be undone.")) return;
    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/api/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory([]);
      setStats({ total: 0, fakeCount: 0, realCount: 0, avgConfidence: 0 });
    } catch (e) {
      alert("Failed to clear history. Please try again.");
    }
  };

  const fmtDate = (iso) => new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <>
      <div className="relative z-10 min-h-screen max-w-[860px] mx-auto px-6 pt-[100px] pb-16">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8" style={{ animation: "fadeUp 0.4s ease both" }}>
          <div>
            <button onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 mb-4 text-sm text-[#64748b] cursor-pointer transition-all hover:text-[#a5b4fc] group"
              style={{ background: "none", border: "none", padding: 0 }}>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:-translate-x-0.5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
                </svg>
              </span>
              Back to Home
            </button>
            <h1 className="font-cabinet font-black text-white mb-2"
              style={{ fontSize: "clamp(2rem,4vw,2.8rem)", letterSpacing: "-1.5px" }}>
              Analysis <span className="gradient-text">History</span>
            </h1>
            <p className="text-[#94a3b8] text-[0.95rem]">Your deepfake detection results, synced from the cloud.</p>
          </div>
          <div className="flex gap-2.5 items-center pt-2">
            {history.length > 0 && (
              <button onClick={clearAll}
                className="px-[18px] py-[9px] rounded-[10px] text-sm text-[#fca5a5] cursor-pointer transition-all font-dm"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                onMouseOut={e  => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                🗑 Clear All
              </button>
            )}
            <button onClick={() => navigate("/analyze")} className="btn-nav-primary">+ New Analysis</button>
          </div>
        </div>

        {/* Summary pills */}
        {stats.total > 0 && (
          <div className="flex gap-4 mb-7 flex-wrap" style={{ animation: "fadeUp 0.4s ease 0.05s both" }}>
            {[
              { val: stats.total,         label: "Total Analyzed",   c: "#a5b4fc", bg: "rgba(99,102,241,0.08)",  b: "rgba(99,102,241,0.2)"  },
              { val: stats.fakeCount,     label: "Fake Detected",    c: "#f87171", bg: "rgba(239,68,68,0.08)",   b: "rgba(239,68,68,0.2)"   },
              { val: stats.realCount,     label: "Real Videos",      c: "#34d399", bg: "rgba(16,185,129,0.08)",  b: "rgba(16,185,129,0.2)"  },
              { val: `${stats.avgConfidence}%`, label: "Avg Confidence", c: "#22d3ee", bg: "rgba(34,211,238,0.08)", b: "rgba(34,211,238,0.2)" },
            ].map(({ val, label, c, bg, b }) => (
              <div key={label} className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl" style={{ background: bg, border: `1px solid ${b}` }}>
                <span className="font-cabinet font-black text-[1.4rem]" style={{ color: c }}>{val}</span>
                <span className="text-xs text-[#64748b]">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {errMsg && (
          <div className="mb-5 px-[18px] py-3 rounded-xl text-sm text-[#f87171]"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            ⚠ {errMsg}
            <button onClick={fetchData} className="ml-3 underline text-[#a5b4fc] cursor-pointer text-xs">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4" style={{ animation: "fadeUp 0.4s ease" }}>
            <div className="spinner" />
            <p className="text-[#64748b] text-sm">Loading your history from the cloud…</p>
          </div>
        ) : history.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 text-[#64748b]" style={{ animation: "fadeUp 0.4s ease 0.1s both" }}>
            <div className="text-5xl mb-4 opacity-40">📂</div>
            <p className="text-[0.9rem] mb-2">No analysis history yet.</p>
            <p className="text-xs mb-5">Upload a video to get started.</p>
            <button onClick={() => navigate("/analyze")}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-[0.875rem] text-[#a5b4fc] cursor-pointer transition-all hover:text-white"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
              Analyze Your First Video →
            </button>
          </div>
        ) : (
          /* History list */
          <div className="flex flex-col gap-3" style={{ animation: "fadeUp 0.4s ease 0.1s both" }}>
            {history.map((item) => {
              const isFake = item.label === "FAKE";
              return (
                <div key={item._id}
                  className="flex items-center gap-4 px-[22px] py-[18px] rounded-[14px] transition-all hover:-translate-y-0.5 group"
                  style={{ background: "#0d1120", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseOver={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"}
                  onMouseOut={e  => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>

                  {/* Label badge */}
                  <span className="px-3.5 py-[5px] rounded-full text-[0.7rem] font-cabinet font-extrabold tracking-wide flex-shrink-0"
                    style={{
                      background: isFake ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                      border:     isFake ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(16,185,129,0.2)",
                      color:      isFake ? "#f87171" : "#34d399",
                    }}>
                    {isFake ? "🚨 FAKE" : "✅ REAL"}
                  </span>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-cabinet font-bold text-white text-[0.9rem] truncate">{item.filename}</div>
                    <div className="text-xs text-[#64748b] mt-0.5">{fmtDate(item.createdAt)}</div>
                  </div>

                  {/* Confidence */}
                  <div className="flex-shrink-0 text-right mr-2">
                    <span className="font-cabinet font-extrabold text-base" style={{ color: isFake ? "#f87171" : "#34d399" }}>
                      {isFake ? (100 - item.confidence).toFixed(1) : item.confidence.toFixed(1)}%
                    </span>
                    <div className="text-[0.7rem] text-[#64748b]">{isFake ? "fake prob." : "true prob."}</div>
                  </div>

                  {/* Delete button — shows on hover */}
                  <button
                    onClick={() => deleteOne(item._id)}
                    disabled={deleting === item._id}
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#64748b] cursor-pointer transition-all opacity-0 group-hover:opacity-100 hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.1)] disabled:opacity-40"
                    style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                    title="Delete this record">
                    {deleting === item._id
                      ? <span className="text-xs animate-spin">⟳</span>
                      : <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    }
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 px-[18px] py-3.5 rounded-xl text-xs text-[#fcd34d] leading-relaxed"
          style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
          ⚠️ <strong>Disclaimer:</strong> Results are AI-generated estimates for research and educational use only. Not suitable for legal or forensic decisions.
        </div>
      </div>
      <Footer />
    </>
  );
}