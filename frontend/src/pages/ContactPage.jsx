// src/pages/ContactPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ContactPage() {
  const navigate = useNavigate();
  const [form,      setForm]      = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [busy,      setBusy]      = useState(false);
  const [errMsg,    setErrMsg]    = useState("");

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setBusy(true);
    setErrMsg("");
    try {
      await axios.post(`${API_URL}/api/contact`, {
        name:    form.name.trim(),
        email:   form.email.trim(),
        subject: form.subject.trim() || "General Inquiry",
        message: form.message.trim(),
      });
      setSubmitted(true);
    } catch (e) {
      setErrMsg(e.response?.data?.error || "Failed to send your message. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const FieldLabel = ({ children }) => (
    <label className="block text-xs text-[#94a3b8] font-medium mb-1.5">{children}</label>
  );

  return (
    <>
      <style>{`
        .form-input:focus { box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; }
        .submit-btn { position: relative; overflow: hidden; transition: all 0.3s ease; }
        .submit-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); transition:left 0.5s ease; }
        .submit-btn:hover::after { left:150%; }
        .submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(99,102,241,0.55) !important; }
      `}</style>

      <div className="relative z-10 min-h-screen max-w-[900px] mx-auto px-6 pt-[100px] pb-16">

        {/* Back */}
        <button onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 mb-8 text-sm text-[#64748b] cursor-pointer transition-all hover:text-[#a5b4fc] group"
          style={{ background: "none", border: "none", padding: 0 }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:-translate-x-0.5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
            </svg>
          </span>
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-12" style={{ animation: "fadeUp 0.4s ease both" }}>
          <div className="inline-flex items-center gap-2 rounded-full px-[18px] py-[7px] mb-6 text-[0.78rem] text-[#a5b4fc]"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee] animate-[pulseDot_2s_infinite]" />
            Get In Touch
          </div>
          <h1 className="font-cabinet font-black text-white mb-4"
            style={{ fontSize: "clamp(2.2rem,5vw,3.5rem)", letterSpacing: "-2px", lineHeight: "1.1" }}>
            Contact <span className="gradient-text">DeepGuard AI</span>
          </h1>
          <p className="text-[#94a3b8] text-[0.95rem] leading-[1.8] max-w-[500px]">
            Have a question, found a bug, or want to collaborate? We'd love to hear from you. Reach out and we'll get back to you as soon as possible.
          </p>
        </div>

        <div>

          {/* Form — full width */}
          <div style={{ animation: "fadeUp 0.4s ease 0.1s both" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="p-8 rounded-[20px]"
                style={{ background: "#0d1120", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="font-cabinet font-extrabold text-white text-lg mb-6">Send a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>Your Name *</FieldLabel>
                    <input type="text" name="name" className="form-input" placeholder="John Doe"
                      value={form.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <FieldLabel>Email Address *</FieldLabel>
                    <input type="email" name="email" className="form-input" placeholder="you@example.com"
                      value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-4">
                  <FieldLabel>Subject</FieldLabel>
                  <input type="text" name="subject" className="form-input" placeholder="What's this about?"
                    value={form.subject} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <FieldLabel>Message *</FieldLabel>
                  <textarea name="message" className="form-input resize-none" placeholder="Tell us more…" rows={5}
                    value={form.message} onChange={handleChange} required style={{ minHeight: "130px" }} />
                </div>

                {/* Error */}
                {errMsg && (
                  <div className="mb-4 px-4 py-3 rounded-xl text-xs text-[#f87171]"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    ⚠ {errMsg}
                  </div>
                )}

                <button type="submit" disabled={busy}
                  className="submit-btn w-full py-[13px] rounded-xl border-none text-white font-cabinet font-extrabold text-[0.95rem] cursor-pointer disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
                  {busy ? "Sending…" : "Send Message →"}
                </button>
              </form>
            ) : (
              <div className="p-10 rounded-[20px] text-center"
                style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.05))", border: "1px solid rgba(16,185,129,0.25)", animation: "fadeUp 0.4s ease" }}>
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-cabinet font-black text-white text-xl mb-2">Message Sent!</h3>
                <p className="text-[#94a3b8] text-sm mb-6">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name:"",email:"",subject:"",message:"" }); }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm text-[#a5b4fc] cursor-pointer transition-all hover:text-white hover:-translate-y-0.5"
                  style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}