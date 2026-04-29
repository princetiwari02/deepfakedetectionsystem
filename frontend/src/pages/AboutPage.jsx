// src/pages/AboutPage.jsx
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const VALUES = [
  { icon: "🛡️", title: "Privacy First",      desc: "We never store your videos permanently. Your data is yours alone, secured by Firebase authentication.", color: "#6366f1" },
  { icon: "🔬", title: "Research-Driven",    desc: "Built on peer-reviewed deep learning research. Our model is continuously improved with new training data.", color: "#a855f7" },
  { icon: "⚡", title: "Speed & Accuracy",   desc: "Sub-5-second analysis with 98.7% detection accuracy — because misinformation spreads fast.", color: "#22d3ee" },
  { icon: "📖", title: "Education Focused",  desc: "Designed for students, researchers, and educators to understand and combat synthetic media.", color: "#10b981" },
];

const TECH = [
  { label: "React + Vite",          color: "#22d3ee" },
  { label: "Firebase Auth",         color: "#f59e0b" },
  { label: "Python Flask",          color: "#10b981" },
  { label: "TensorFlow / PyTorch",  color: "#ef4444" },
  { label: "Tailwind CSS",          color: "#06b6d4" },
  { label: "Deep Learning CNN",     color: "#a855f7" },
  { label: "Axios REST API",        color: "#6366f1" },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        /* Value card hover */
        .val-card {
          transition: all 0.38s cubic-bezier(0.34,1.3,0.64,1);
          position: relative;
          overflow: hidden;
        }
        .val-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          opacity: 0;
          transition: opacity 0.35s ease 0.1s;
        }
        .val-card:hover { transform: translateY(-8px) scale(1.02); }
        .val-card:hover::after { opacity: 1; }
        .val-card .val-icon { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
        .val-card:hover .val-icon { transform: scale(1.18) rotate(-8deg); }
        .val-card .val-title { transition: letter-spacing 0.3s ease; }
        .val-card:hover .val-title { letter-spacing: 0.3px; }

        /* Tech pill hover */
        .tech-pill {
          transition: all 0.28s cubic-bezier(0.34,1.4,0.64,1);
          cursor: default;
        }
        .tech-pill:hover { transform: translateY(-3px) scale(1.08); }

        /* Mission banner hover */
        .mission-banner {
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .mission-banner::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at center, rgba(99,102,241,0.08) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .mission-banner:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(99,102,241,0.18); }
        .mission-banner:hover::before { opacity: 1; }
      `}</style>

      <div className="relative z-10 min-h-screen max-w-[900px] mx-auto px-6 pt-[100px] pb-16">

        {/* Back */}
        <button onClick={()=>navigate("/")}
          className="inline-flex items-center gap-2 mb-8 text-sm text-[#64748b] cursor-pointer transition-all hover:text-[#a5b4fc] group"
          style={{background:"none",border:"none",padding:0}}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:-translate-x-0.5"
            style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)"}}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          </span>
          Back to Home
        </button>

        {/* Hero */}
        <div className="mb-16" style={{animation:"fadeUp 0.4s ease both"}}>
          <div className="inline-flex items-center gap-2 rounded-full px-[18px] py-[7px] mb-6 text-[0.78rem] text-[#a5b4fc]"
            style={{background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.25)"}}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee] animate-[pulseDot_2s_infinite]" />
            Our Mission
          </div>
          <h1 className="font-cabinet font-black text-white mb-5"
            style={{fontSize:"clamp(2.2rem,5vw,3.5rem)",letterSpacing:"-2px",lineHeight:"1.1"}}>
            Fighting Misinformation<br /><span className="gradient-text">One Frame at a Time</span>
          </h1>
          <p className="text-[#94a3b8] text-[1rem] leading-[1.85] max-w-[620px]">
            DeepGuard AI was built as an academic research project to make deepfake detection accessible to everyone. As synthetic media becomes increasingly sophisticated, we believe powerful detection tools should be free, fast, and available to all.
          </p>
        </div>

        {/* Mission banner */}
        <div className="mission-banner rounded-[20px] p-10 mb-16"
          style={{animation:"fadeUp 0.4s ease 0.1s both", background:"linear-gradient(135deg,rgba(99,102,241,0.12),rgba(168,85,247,0.08))", border:"1px solid rgba(99,102,241,0.25)"}}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
            style={{background:"radial-gradient(circle,#a855f7,transparent)"}} />
          <div className="relative z-10">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-cabinet font-black text-white text-xl mb-3">Our Goal</h3>
            <p className="text-[#94a3b8] text-[0.92rem] leading-[1.8] max-w-[560px]">
              To provide a reliable, privacy-respecting deepfake detection tool for students, journalists, researchers, and everyday users — helping society identify and combat AI-generated misinformation before it causes harm.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16" style={{animation:"fadeUp 0.4s ease 0.15s both"}}>
          <h2 className="font-cabinet font-black text-white mb-8"
            style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",letterSpacing:"-1px"}}>
            Our <span className="gradient-text">Core Values</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map(({icon,title,desc,color})=>(
              <div key={title} className="val-card p-6 rounded-[16px]"
                style={{background:"#0d1120", border:`1px solid rgba(255,255,255,0.07)`}}
                onMouseOver={e=>{e.currentTarget.style.borderColor=`${color}50`; e.currentTarget.style.background=`${color}0a`;}}
                onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.background="#0d1120";}}>
                {/* accent bottom line */}
                <div className="val-icon w-11 h-11 rounded-[12px] flex items-center justify-center text-xl mb-4"
                  style={{background:`${color}18`,border:`1px solid ${color}30`}}>{icon}</div>
                <div className="val-title font-cabinet font-extrabold text-[0.97rem] mb-2" style={{color}}>{title}</div>
                <div className="text-[#64748b] text-[0.85rem] leading-[1.7]">{desc}</div>
                {/* bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-[16px] opacity-0 transition-opacity duration-300"
                  style={{background:`linear-gradient(90deg,transparent,${color},transparent)`}} />
              </div>
            ))}
          </div>
        </div>


        {/* Disclaimer */}
        <div className="mt-6 px-[18px] py-3.5 rounded-xl text-xs text-[#fcd34d] leading-relaxed"
          style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)"}}>
          ⚠️ <strong>Academic Project:</strong> DeepGuard AI was created for educational and research purposes. Detection results are AI estimates and should not be used for legal or forensic decisions.
        </div>
      </div>
      <Footer />
    </>
  );
}