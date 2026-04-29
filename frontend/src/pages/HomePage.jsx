// src/pages/HomePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import HeroIllustration from "../components/HeroIllustration";

const FAQ_ITEMS = [
  { q: "How does DeepGuard AI detect deepfakes?", a: "DeepGuard AI uses a deep learning model trained on thousands of real and fake videos. It analyzes every frame of your uploaded video, looking for facial inconsistencies, blending artifacts, unnatural eye movements, and temporal anomalies — then returns a REAL or FAKE verdict with a confidence score." },
  { q: "What video formats does DeepGuard AI support?", a: "We currently support MP4, AVI, and MOV video formats. The maximum file size is 100MB. We recommend uploading clear, well-lit videos for the most accurate results." },
  { q: "How accurate is the deepfake detection?", a: "Our AI model achieves up to 98.7% detection accuracy on our test datasets. However, results may vary depending on video quality, lighting conditions, and the sophistication of the deepfake technique used. Always treat results as an AI estimate, not a legal conclusion." },
  { q: "Is my video stored after analysis?", a: "No. Your privacy is our priority. Videos are processed in real-time and are never stored permanently on our servers. Only the result metadata (filename, label, confidence score) is saved to your personal history log, secured via Firebase." },
  { q: "How fast is the analysis?", a: "Most videos are analyzed in under 5 seconds. Processing time may vary slightly based on video length, resolution, and server load. You'll see a live progress indicator while your video is being scanned." },
  { q: "Can I use DeepGuard AI for legal or forensic purposes?", a: "DeepGuard AI is designed for educational and research purposes only. Results should not be used as sole evidence in any legal, forensic, or formal decision-making process. Always consult qualified professionals for legal matters." },
];

export default function HomePage({ onOpenModal }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [hoveredFaq, setHoveredFaq] = useState(null);
  const handleAnalyze = () => !user ? onOpenModal("login") : navigate("/analyze");

  return (
    <>
      <style>{`
        @keyframes borderRun {
          0%   { background-position: 0% 0%; }
          100% { background-position: 300% 0%; }
        }
        @keyframes scanLineImg {
          0%   { top: 10%; opacity: 0; }
          15%  { opacity: 0.8; }
          85%  { opacity: 0.8; }
          100% { top: 85%; opacity: 0; }
        }
        .stat-cell { transition: all 0.35s cubic-bezier(0.34,1.4,0.64,1); }
        .stat-cell:hover { transform: translateY(-6px) scale(1.03); background: rgba(99,102,241,0.1) !important; box-shadow: 0 12px 32px rgba(99,102,241,0.2); }
        .stat-cell:hover .stat-num { filter: drop-shadow(0 0 14px rgba(99,102,241,0.7)); transform: scale(1.1); }
        .stat-num { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s; display: block; }
        .tech-feature {
          padding: 16px 18px;
          border-radius: 14px;
          border: 1px solid transparent;
          transition: all 0.35s cubic-bezier(0.34,1.2,0.64,1);
        }
        .tech-feature:hover {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.06);
          transform: translateX(8px);
          box-shadow: -4px 0 24px rgba(99,102,241,0.15), 0 4px 20px rgba(99,102,241,0.08);
        }
        .tech-feature:hover .tech-icon {
          transform: scale(1.18) rotate(-6deg);
          box-shadow: 0 8px 28px rgba(99,102,241,0.35);
        }
        .tech-icon { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s; }
        .faq-item {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .faq-item::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 1.5px;
          background: linear-gradient(90deg,#6366f1,#a855f7,#22d3ee,#6366f1);
          background-size: 300% 100%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .faq-item:hover::before, .faq-item.faq-open::before {
          opacity: 1;
          animation: borderRun 2.5s linear infinite;
        }
        .faq-item:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(99,102,241,0.18); }
      `}</style>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex items-center px-6 pt-[88px] pb-16" style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full px-[18px] py-[7px] mb-8 text-[0.78rem] text-[#a5b4fc]"
              style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.25)", animation:"slideInLeft 0.6s ease both" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee] animate-[pulseDot_2s_infinite]" />
              AI-Powered Deepfake Detection System
            </div>
            <h1 className="font-cabinet font-black text-white mb-6 text-left"
              style={{ fontSize:"clamp(2.8rem,6vw,5.2rem)", lineHeight:"1.0", letterSpacing:"-2.5px", animation:"slideInLeft 0.6s ease 0.1s both" }}>
              Detect Deepfakes<br /><span className="gradient-text">Before They</span><br /><span className="gradient-text">Spread</span>
            </h1>
            <p className="text-[#94a3b8] leading-[1.85] mb-10 text-left max-w-[480px]"
              style={{ fontSize:"clamp(0.95rem,1.5vw,1.1rem)", animation:"slideInLeft 0.6s ease 0.2s both" }}>
              DeepGuard AI uses advanced deep learning to analyze videos in seconds — identifying manipulated content with high confidence scores before it causes harm.
            </p>
            <div style={{ animation:"slideInLeft 0.6s ease 0.3s both" }}>
              <div className="flex items-center gap-3 flex-wrap mb-7">
                <button onClick={handleAnalyze}
                  className="inline-flex items-center gap-3 rounded-2xl text-white border-none cursor-pointer font-cabinet font-extrabold transition-all hover:-translate-y-1"
                  style={{ padding:"17px 42px", fontSize:"1rem", background:"linear-gradient(135deg,#6366f1,#a855f7)", boxShadow:"0 8px 32px rgba(99,102,241,0.5)" }}
                  onMouseOver={e => e.currentTarget.style.boxShadow="0 14px 44px rgba(99,102,241,0.7)"}
                  onMouseOut={e  => e.currentTarget.style.boxShadow="0 8px 32px rgba(99,102,241,0.5)"}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
                  Analyze a Video
                </button>
                {!user && (
                  <button onClick={() => onOpenModal("signup")}
                    className="inline-flex items-center gap-2 rounded-2xl cursor-pointer font-cabinet font-extrabold transition-all hover:-translate-y-1"
                    style={{ padding:"17px 32px", fontSize:"1rem", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", color:"#f1f5f9" }}>
                    Sign Up Free →
                  </button>
                )}
              </div>
              <div className="flex items-center gap-5 flex-wrap">
                {[{ color:"#10b981", label:"No video stored permanently" },{ color:"#6366f1", label:"Firebase secured" },{ color:"#22d3ee", label:"Results in seconds" }].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-[#64748b]">
                    <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background:color, boxShadow:`0 0 6px ${color}` }} />{label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-start justify-center pt-2" style={{ animation:"slideInRight 0.7s ease 0.2s both" }}>
            <HeroIllustration />
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.4),rgba(168,85,247,0.4),transparent)" }} />

      {/* STATS */}
      <section className="relative z-10 max-w-[1100px] mx-auto px-6 py-[90px] text-center">
        <div className="inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[3px] uppercase text-[#a5b4fc] mb-5 before:content-[''] before:w-5 before:h-px before:bg-[#6366f1]">Why DeepGuard AI</div>
        <h2 className="font-cabinet font-black text-white mb-5" style={{ fontSize:"clamp(2rem,4vw,3.2rem)", letterSpacing:"-1.5px", lineHeight:"1.1" }}>
          Built for <span className="gradient-text">Speed, Accuracy</span> &amp; Trust
        </h2>
        <p className="text-[#94a3b8] text-[0.95rem] leading-[1.75] max-w-[580px] mx-auto mb-14">
          DeepGuard AI combines state-of-the-art deep learning with a seamless upload experience — delivering reliable deepfake verdicts in seconds, completely privately.
        </p>
        <div className="flex items-stretch justify-center rounded-2xl overflow-visible mx-auto gap-0"
          style={{ border:"1px solid rgba(99,102,241,0.2)", background:"rgba(13,17,32,0.8)", backdropFilter:"blur(12px)", maxWidth:"760px", borderRadius:"16px" }}>
          {[
            { num:"98.7%", label:"Detection Accuracy", color:"#a5b4fc" },
            { num:"<5s",   label:"Analysis Time",       color:"#22d3ee" },
            { num:"100MB", label:"Max File Size",       color:"#c084fc" },
            { num:"3",     label:"Supported Formats",    color:"#34d399" },
          ].map(({ num, label, color }, i) => (
            <div key={label} className="stat-cell flex-1 flex flex-col items-center justify-center py-8 px-4 rounded-2xl"
              style={{ borderRight: i < 3 ? "1px solid rgba(99,102,241,0.15)" : "none", background:"transparent", borderRadius: i===0?"16px 0 0 16px": i===3?"0 16px 16px 0":"0" }}>
              <span className="stat-num font-cabinet font-black mb-1.5"
                style={{ fontSize:"clamp(1.6rem,3vw,2.2rem)", background:`linear-gradient(135deg,#fff,${color})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                {num}
              </span>
              <div className="text-[0.72rem] text-[#64748b] tracking-wide uppercase font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="relative z-10 w-full h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.3),rgba(34,211,238,0.3),transparent)" }} />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 max-w-[1100px] mx-auto px-6 py-[100px]">
        <div className="inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[3px] uppercase text-[#a5b4fc] mb-[18px] before:content-[''] before:w-5 before:h-px before:bg-[#6366f1]">How It Works</div>
        <h2 className="font-cabinet font-black text-white mb-3.5" style={{ fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-1.5px", lineHeight:"1.1" }}>Three steps to the truth</h2>
        <p className="text-[#94a3b8] text-[0.95rem] leading-[1.75] max-w-[480px] mb-14">Fast, secure, and accurate — from upload to result in seconds.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num:"01", label:"Upload", icon:"📤", color:"#6366f1", cBg:"rgba(99,102,241,0.12)", cBorder:"rgba(99,102,241,0.2)", grad:"linear-gradient(90deg,#6366f1,#818cf8)", title:"Upload Your Video", desc:"Drag and drop or browse to select your video. Supports MP4, AVI, and MOV formats up to 100MB. No video is stored permanently." },
            { num:"02", label:"Analyze", icon:"🧠", color:"#a855f7", cBg:"rgba(168,85,247,0.12)", cBorder:"rgba(168,85,247,0.2)", grad:"linear-gradient(90deg,#a855f7,#c084fc)", title:"AI Model Analyzes", desc:"Our deep learning model scans every frame for deepfake patterns — facial inconsistencies, blending artifacts, and temporal anomalies." },
            { num:"03", label:"Result", icon:"📊", color:"#22d3ee", cBg:"rgba(34,211,238,0.12)", cBorder:"rgba(34,211,238,0.2)", grad:"linear-gradient(90deg,#22d3ee,#67e8f9)", title:"Get Your Result", desc:"Receive a clear REAL or FAKE verdict with a confidence score. Results are saved securely to your personal history log." },
          ].map(({ num, label, icon, color, cBg, cBorder, grad, title, desc }) => (
            <div key={num} className="step-card" onClick={handleAnalyze}>
              <div className="step-accent-line" style={{ background:grad }} />
              <div className="step-badge" style={{ color, background:`${color}25`, border:`1px solid ${color}50` }}>{num}</div>
              <div className="step-num">{num} — {label.toUpperCase()}</div>
              <div className="step-icon" style={{ background:cBg, border:`1px solid ${cBorder}` }}>{icon}</div>
              <div className="step-title">{title}</div>
              <div className="step-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="relative z-10 w-full h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.4),rgba(168,85,247,0.4),transparent)" }} />

      {/* AI TECHNOLOGY */}
      <section className="relative z-10 max-w-[1100px] mx-auto px-6 py-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[3px] uppercase text-[#a5b4fc] mb-5 before:content-[''] before:w-5 before:h-px before:bg-[#6366f1]">Our Technology</div>
            <h2 className="font-cabinet font-black text-white mb-5" style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", letterSpacing:"-1.5px", lineHeight:"1.15" }}>
              Advanced <span className="gradient-text">AI Detection</span><br />You Can Trust
            </h2>
            <p className="text-[#94a3b8] text-[0.93rem] leading-[1.8] mb-10">
              Our platform leverages state-of-the-art deep learning models trained on thousands of real and manipulated videos — achieving up to 98.7% accuracy in identifying synthetic and deepfake content.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon:"🎞️", color:"#6366f1", bg:"rgba(99,102,241,0.12)", border:"rgba(99,102,241,0.25)", title:"Frame-by-Frame Analysis", desc:"Every single frame of your video is scanned by our AI model, catching even the most subtle deepfake artifacts that a human eye would miss." },
                { icon:"📊", color:"#a855f7", bg:"rgba(168,85,247,0.12)", border:"rgba(168,85,247,0.25)", title:"Confidence Score Engine", desc:"Get a precise percentage confidence score alongside your REAL or FAKE verdict — so you understand exactly how certain the AI is about its finding." },
                { icon:"🔒", color:"#22d3ee", bg:"rgba(34,211,238,0.12)", border:"rgba(34,211,238,0.25)", title:"Secure & Private by Design", desc:"Your videos are never stored permanently. Firebase authentication ensures only you can access your analysis history, keeping your data private." },
              ].map(({ icon, color, bg, border, title, desc }) => (
                <div key={title} className="tech-feature flex gap-4 items-start">
                  <div className="tech-icon w-11 h-11 rounded-[12px] flex items-center justify-center text-xl flex-shrink-0" style={{ background:bg, border:`1px solid ${border}` }}>{icon}</div>
                  <div>
                    <div className="font-cabinet font-extrabold text-[0.97rem] mb-1.5" style={{ color }}>{title}</div>
                    <div className="text-[#64748b] text-[0.85rem] leading-[1.7]">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex justify-center items-center">
            <div className="relative rounded-[24px] overflow-hidden w-full" style={{ border:"1px solid rgba(99,102,241,0.25)", boxShadow:"0 30px 80px rgba(99,102,241,0.2)" }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" alt="Deepfake detection" className="w-full object-cover" style={{ height:"420px", display:"block" }} />
              <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,rgba(13,17,32,0.2) 0%,rgba(13,17,32,0.6) 100%)" }} />
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor:"#6366f1" }} />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor:"#6366f1" }} />
              <div className="absolute bottom-20 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor:"#6366f1" }} />
              <div className="absolute bottom-20 right-4 w-8 h-8 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor:"#6366f1" }} />
              <div className="absolute left-4 right-4 h-0.5 opacity-70" style={{ background:"linear-gradient(90deg,transparent,#22d3ee,transparent)", animation:"scanLineImg 2.5s ease-in-out infinite", top:"30%" }} />
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] px-5 py-3.5 rounded-xl flex items-center justify-between gap-3" style={{ background:"rgba(13,17,32,0.92)", border:"1px solid rgba(239,68,68,0.4)", backdropFilter:"blur(12px)" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background:"rgba(239,68,68,0.15)" }}>🚨</div>
                  <div>
                    <div className="font-cabinet font-extrabold text-[#f87171] text-[0.8rem] tracking-wide">FAKE DETECTED</div>
                    <div className="text-[#64748b] text-[0.7rem]">Deepfake manipulation found</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-cabinet font-black text-[#f87171] text-lg">94.6%</div>
                  <div className="text-[#64748b] text-[0.65rem]">confidence</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl text-xs font-cabinet font-bold text-[#22d3ee]" style={{ background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.3)", animation:"floatChip 4s ease-in-out infinite" }}>🤖 AI Analyzing…</div>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(34,211,238,0.3),rgba(99,102,241,0.3),transparent)" }} />

      {/* FAQ */}
      <section className="relative z-10 max-w-[800px] mx-auto px-6 py-[100px]">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[3px] uppercase text-[#a5b4fc] mb-5 before:content-[''] before:w-5 before:h-px before:bg-[#6366f1] after:content-[''] after:w-5 after:h-px after:bg-[#6366f1]">FAQ</div>
          <h2 className="font-cabinet font-black text-white mb-4" style={{ fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-1.5px" }}>Frequently Asked <span className="gradient-text">Questions</span></h2>
          <p className="text-[#94a3b8] text-[0.95rem] leading-[1.75] max-w-[480px] mx-auto">Everything you need to know about DeepGuard AI and how our deepfake detection works.</p>
        </div>
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? "faq-open" : ""}`}
              style={{ background: openFaq === i ? "rgba(99,102,241,0.08)" : "#0d1120", border:`1px solid ${openFaq===i ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.07)"}` }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              onMouseEnter={() => setHoveredFaq(i)}
              onMouseLeave={() => setHoveredFaq(null)}>
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
                  style={{ background: openFaq===i || hoveredFaq===i ? "#6366f1":"#334155", boxShadow: openFaq===i || hoveredFaq===i ? "0 0 8px #6366f1":"none" }} />
                <span className="flex-1 font-cabinet font-bold text-[0.95rem] transition-colors duration-300"
                  style={{ color: openFaq===i || hoveredFaq===i ? "#e2e8f0":"#94a3b8" }}>{item.q}</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                  className="flex-shrink-0 transition-all duration-300"
                  style={{ color: openFaq===i ? "#6366f1" : hoveredFaq===i ? "#a5b4fc":"#475569", transform: openFaq===i ? "rotate(180deg)":"rotate(0deg)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                </svg>
              </div>
              {openFaq === i && (
                <div className="px-6 pb-5 pl-[52px]" style={{ animation:"fadeUp 0.25s ease" }}>
                  <p className="text-[#64748b] text-[0.87rem] leading-[1.8]">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}