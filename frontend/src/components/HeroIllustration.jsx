// src/components/HeroIllustration.jsx
export default function HeroIllustration() {
  return (
    <div
      className="relative w-full flex items-center justify-center select-none hero-illus-root"
      style={{ maxWidth: "620px" }}
    >
      {/* ── Outer glow ring ─────────────────────────────────────── */}
      <div className="absolute rounded-full illus-glow-ring"
        style={{
          width: "560px", height: "560px",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.06) 50%, transparent 70%)",
          animation: "pulseRing 3s ease-in-out infinite",
          transition: "all 0.5s ease",
        }} />

      {/* ── Main SVG canvas ─────────────────────────────────────── */}
      <svg
        viewBox="0 0 400 420"
        width="100%"
        className="illus-svg"
        style={{ maxWidth: "620px", filter: "drop-shadow(0 0 40px rgba(99,102,241,0.2))", transition: "filter 0.4s ease, transform 0.4s ease" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#1e2a4a" />
            <stop offset="100%" stopColor="#0d1120" />
          </linearGradient>
          <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%"  stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%"  stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="glitchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f43f5e" stopOpacity="0.15" />
            <stop offset="50%"  stopColor="#6366f1" stopOpacity="0.1"  />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.15" />
          </linearGradient>
          <clipPath id="faceClip">
            <rect x="80" y="40" width="240" height="280" rx="24" />
          </clipPath>
          <clipPath id="scanClip">
            <rect x="80" y="40" width="240" height="280" rx="24" />
          </clipPath>
          <filter id="nodeBloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="cardGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── Background grid ──────────────────────────────────── */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`hg${i}`} x1="40" y1={60 + i * 45} x2="360" y2={60 + i * 45}
            stroke="rgba(99,102,241,0.07)" strokeWidth="1" className="grid-line" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`vg${i}`} x1={40 + i * 46} y1="40" x2={40 + i * 46} y2="400"
            stroke="rgba(99,102,241,0.07)" strokeWidth="1" className="grid-line" />
        ))}

        {/* ── Glitch strips (hidden, animate on hover) ─────────── */}
        <rect x="80" y="90"  width="240" height="3" fill="url(#glitchGrad)" className="glitch-strip s1" opacity="0" />
        <rect x="80" y="160" width="240" height="2" fill="url(#glitchGrad)" className="glitch-strip s2" opacity="0" />
        <rect x="80" y="230" width="240" height="3" fill="url(#glitchGrad)" className="glitch-strip s3" opacity="0" />

        {/* ── Face card ────────────────────────────────────────── */}
        <rect x="80" y="40" width="240" height="280" rx="24"
          fill="url(#faceGrad)" stroke="rgba(99,102,241,0.35)" strokeWidth="1.5"
          className="face-card" />
        <rect x="82" y="42" width="236" height="276" rx="22"
          fill="none" stroke="rgba(99,102,241,0)" strokeWidth="1"
          className="face-card-inner-glow" />

        {/* ── Face silhouette ──────────────────────────────────── */}
        <ellipse cx="200" cy="155" rx="72" ry="85"
          fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.2)" strokeWidth="1"
          className="face-silhouette" />
        <rect x="183" y="225" width="34" height="36" rx="6" fill="rgba(99,102,241,0.06)" />
        <path d="M120 280 Q160 255 200 260 Q240 255 280 280"
          fill="none" stroke="rgba(99,102,241,0.18)" strokeWidth="1.5" />

        {/* ── Face features ────────────────────────────────────── */}
        <ellipse cx="172" cy="145" rx="14" ry="9"
          fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth="1.2" className="eye-left" />
        <circle cx="172" cy="145" r="4" fill="rgba(99,102,241,0.25)" className="pupil-left" />
        <ellipse cx="228" cy="145" rx="14" ry="9"
          fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth="1.2" className="eye-right" />
        <circle cx="228" cy="145" r="4" fill="rgba(99,102,241,0.25)" className="pupil-right" />
        <path d="M196 158 Q200 172 204 158" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="1.2" />
        <path d="M184 185 Q200 196 216 185" fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth="1.5" strokeLinecap="round" className="mouth" />

        {/* ── Scan lines ───────────────────────────────────────── */}
        <g clipPath="url(#scanClip)">
          <rect x="80" y="0" width="240" height="60" fill="url(#scanGrad)"
            className="scan-sweep" style={{ animation: "scanSweep 3s ease-in-out infinite" }} />
        </g>
        <g clipPath="url(#scanClip)">
          <rect x="80" y="150" width="240" height="2" fill="url(#cyanGrad)"
            className="scan-flash" style={{ animation: "scanFlash 3s ease-in-out infinite" }} />
        </g>

        {/* ── Brackets ─────────────────────────────────────────── */}
        <path d="M112 72 L96 72 L96 92"     fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" className="bracket" />
        <path d="M288 72 L304 72 L304 92"   fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" className="bracket" />
        <path d="M112 288 L96 288 L96 268"  fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" className="bracket" />
        <path d="M288 288 L304 288 L304 268" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" className="bracket" />

        {/* ── Detection nodes ──────────────────────────────────── */}
        {[
          [172,145],[228,145],[200,165],[200,185],[184,185],[216,185],
          [158,130],[242,130],[200,120],[175,200],[225,200],
        ].map(([cx, cy], i) => (
          <g key={i} className="node-group">
            {i < 6 && (
              <line x1={cx} y1={cy} x2={200} y2={165}
                stroke="rgba(99,102,241,0.15)" strokeWidth="0.8" className="mesh-line" />
            )}
            <circle cx={cx} cy={cy} r="2.5" fill="#6366f1" opacity="0.7" className="node-dot"
              style={{ animation: `nodePulse 2s ease-in-out infinite ${i * 0.18}s` }} />
            <circle cx={cx} cy={cy} r="5" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="0.8" className="node-ring"
              style={{ animation: `nodePulse 2s ease-in-out infinite ${i * 0.18}s` }} />
          </g>
        ))}

        {/* ── FAKE box ─────────────────────────────────────────── */}
        <rect x="148" y="108" width="104" height="78" rx="6"
          fill="none" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeDasharray="6 3"
          className="fake-box" style={{ animation: "dashMove 2s linear infinite" }} />
        <rect x="148" y="100" width="44" height="16" rx="4"
          fill="rgba(239,68,68,0.85)" style={{ animation: "fadeInOut 3s ease-in-out infinite" }} />
        <text x="170" y="112" textAnchor="middle" fill="white" fontSize="8"
          fontFamily="Cabinet Grotesk, sans-serif" fontWeight="700">FAKE</text>
        <text x="202" y="112" textAnchor="start" fill="rgba(239,68,68,0.8)" fontSize="7.5" fontFamily="DM Sans, sans-serif">94.6%</text>

        {/* ── Radar rings ──────────────────────────────────────── */}
        {[28, 52, 76].map((r, i) => (
          <circle key={i} cx="200" cy="155" r={r}
            fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="1"
            className="radar-ring"
            style={{ animation: `radarPing 3s ease-out infinite ${i * 0.8}s` }} />
        ))}

        {/* ── Verdict card ─────────────────────────────────────── */}
        <rect x="70" y="340" width="260" height="68" rx="16"
          fill="#0d1120" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5"
          className="verdict-card" />
        <rect x="70" y="340" width="260" height="68" rx="16" fill="rgba(239,68,68,0.04)" />
        <circle cx="104" cy="374" r="16"
          fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.2"
          className="alert-circle" />
        <text x="104" y="379" textAnchor="middle" fontSize="14">🚨</text>
        <text x="128" y="367" fill="#f87171"
          fontSize="10.5" fontFamily="Cabinet Grotesk, sans-serif" fontWeight="800" letterSpacing="0.5">
          DEEPFAKE DETECTED
        </text>
        <rect x="128" y="374" width="140" height="5" rx="3" fill="rgba(255,255,255,0.06)" />
        <rect x="128" y="374" width="132" height="5" rx="3"
          fill="url(#indigoGrad)" style={{ animation: "barGrow 1.5s ease-out 0.5s both" }} />
        <text x="128" y="391" fill="rgba(248,113,113,0.7)" fontSize="8" fontFamily="DM Sans, sans-serif">
          Confidence: 94.6%
        </text>

        {/* ── Floating chips ───────────────────────────────────── */}
        <g style={{ animation: "floatChip 4s ease-in-out infinite 0s" }} className="chip">
          <rect x="306" y="80" width="88" height="36" rx="10" fill="#0d1120" stroke="rgba(34,211,238,0.4)" strokeWidth="1.2" className="chip-rect" />
          <circle cx="320" cy="98" r="5" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.6)" strokeWidth="1" />
          <text x="330" y="95"  fill="#67e8f9" fontSize="7.5" fontFamily="DM Sans, sans-serif" fontWeight="600">Frame</text>
          <text x="330" y="105" fill="rgba(103,232,249,0.6)" fontSize="7" fontFamily="DM Sans, sans-serif">Analysis</text>
        </g>

        <g style={{ animation: "floatChip 4s ease-in-out infinite 1.3s" }} className="chip">
          <rect x="310" y="160" width="80" height="36" rx="10" fill="#0d1120" stroke="rgba(168,85,247,0.4)" strokeWidth="1.2" className="chip-rect" />
          <circle cx="324" cy="178" r="5" fill="rgba(168,85,247,0.2)" stroke="rgba(168,85,247,0.6)" strokeWidth="1" />
          <text x="334" y="175" fill="#c084fc" fontSize="7.5" fontFamily="DM Sans, sans-serif" fontWeight="600">AI</text>
          <text x="334" y="185" fill="rgba(192,132,252,0.6)" fontSize="7" fontFamily="DM Sans, sans-serif">Model</text>
        </g>

        <g style={{ animation: "floatChip 4s ease-in-out infinite 2.6s" }} className="chip">
          <rect x="308" y="240" width="84" height="36" rx="10" fill="#0d1120" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" className="chip-rect" />
          <circle cx="322" cy="258" r="5" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.6)" strokeWidth="1" />
          <text x="332" y="255" fill="#34d399" fontSize="7.5" fontFamily="DM Sans, sans-serif" fontWeight="600">Secure</text>
          <text x="332" y="265" fill="rgba(52,211,153,0.6)" fontSize="7" fontFamily="DM Sans, sans-serif">Firebase</text>
        </g>

        <g style={{ animation: "floatChip 5s ease-in-out infinite 0.5s" }} className="chip">
          <rect x="12" y="120" width="62" height="28" rx="8" fill="#0d1120" stroke="rgba(99,102,241,0.35)" strokeWidth="1" className="chip-rect" />
          <text x="43" y="131" textAnchor="middle" fill="#a5b4fc" fontSize="7" fontFamily="DM Sans, sans-serif" fontWeight="600">Deep</text>
          <text x="43" y="141" textAnchor="middle" fill="rgba(165,180,252,0.6)" fontSize="6.5" fontFamily="DM Sans, sans-serif">Learning</text>
        </g>

        <g style={{ animation: "floatChip 5s ease-in-out infinite 2s" }} className="chip">
          <rect x="6" y="210" width="66" height="28" rx="8" fill="#0d1120" stroke="rgba(34,211,238,0.35)" strokeWidth="1" className="chip-rect" />
          <text x="39" y="221" textAnchor="middle" fill="#67e8f9" fontSize="7" fontFamily="DM Sans, sans-serif" fontWeight="600">Real-Time</text>
          <text x="39" y="231" textAnchor="middle" fill="rgba(103,232,249,0.6)" fontSize="6.5" fontFamily="DM Sans, sans-serif">Detection</text>
        </g>

        {/* ── Orbit ────────────────────────────────────────────── */}
        <circle cx="200" cy="155" r="100"
          fill="none" stroke="rgba(99,102,241,0.06)" strokeWidth="1"
          strokeDasharray="4 8" className="orbit-ring" />
        <circle cx="0" cy="0" r="4" fill="#6366f1" opacity="0.6" className="orbit-dot"
          style={{ animation: "orbitDot 8s linear infinite" }} transform="translate(200,155)" />
        <circle cx="0" cy="0" r="3" fill="#22d3ee" opacity="0.5" className="orbit-dot"
          style={{ animation: "orbitDot 8s linear infinite 4s" }} transform="translate(200,155)" />

      </svg>

      {/* ── Keyframes + hover styles ─────────────────────────────── */}
      <style>{`
        /* ── Base animations ── */
        @keyframes scanSweep {
          0%   { transform: translateY(40px);  opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
        @keyframes scanFlash {
          0%   { transform: translateY(-120px); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(120px);  opacity: 0; }
        }
        @keyframes nodePulse {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 1;   }
        }
        @keyframes radarPing {
          0%   { r: 20px;  opacity: 0.5; }
          100% { r: 100px; opacity: 0;   }
        }
        @keyframes dashMove {
          0%   { stroke-dashoffset: 0;  }
          100% { stroke-dashoffset: 24; }
        }
        @keyframes fadeInOut {
          0%,100% { opacity: 0.7; }
          50%     { opacity: 1;   }
        }
        @keyframes barGrow {
          from { width: 0; }
          to   { width: 132px; }
        }
        @keyframes floatChip {
          0%,100% { transform: translateY(0px);  }
          50%     { transform: translateY(-8px); }
        }
        @keyframes orbitDot {
          0%   { transform: translate(200px,155px) rotate(0deg)   translate(100px,0); }
          100% { transform: translate(200px,155px) rotate(360deg) translate(100px,0); }
        }
        @keyframes pulseRing {
          0%,100% { transform: scale(1);    opacity: 1;   }
          50%     { transform: scale(1.05); opacity: 0.7; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Hover-only keyframes ── */
        @keyframes shimmerBorder {
          0%,100% { stroke: rgba(99,102,241,0.35); }
          50%     { stroke: rgba(139,92,246,0.95);  }
        }
        @keyframes bracketCyan {
          0%,100% { stroke: #6366f1; stroke-width: 2.5px; }
          50%     { stroke: #22d3ee; stroke-width: 3.8px; }
        }
        @keyframes nodeBloom {
          0%,100% { opacity: 0.7; fill: #6366f1; }
          50%     { opacity: 1;   fill: #22d3ee; }
        }
        @keyframes glitchSlide1 {
          0%,100% { transform: translateX(0);    opacity: 0;   }
          10%     { transform: translateX(-9px); opacity: 0.9; }
          20%     { transform: translateX(6px);  opacity: 0.6; }
          35%     { transform: translateX(-3px); opacity: 0.8; }
          45%     { transform: translateX(0);    opacity: 0;   }
        }
        @keyframes glitchSlide2 {
          0%,100% { transform: translateX(0);    opacity: 0;   }
          15%     { transform: translateX(11px); opacity: 0.7; }
          28%     { transform: translateX(-8px); opacity: 0.5; }
          40%     { transform: translateX(0);    opacity: 0;   }
        }
        @keyframes glitchSlide3 {
          0%,100% { transform: translateX(0);     opacity: 0;   }
          20%     { transform: translateX(-13px); opacity: 0.8; }
          33%     { transform: translateX(9px);   opacity: 0.6; }
          48%     { transform: translateX(0);     opacity: 0;   }
        }
        @keyframes verdictRedPulse {
          0%,100% { stroke: rgba(239,68,68,0.4);  }
          50%     { stroke: rgba(239,68,68,0.95); }
        }
        @keyframes scanSweepFast {
          0%   { transform: translateY(40px);  opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }

        /* ══════════════════════════════════════════
           HOVER STATE
        ══════════════════════════════════════════ */

        /* Whole SVG lifts & glows stronger */
        .hero-illus-root:hover .illus-svg {
          filter: drop-shadow(0 0 80px rgba(99,102,241,0.6))
                  drop-shadow(0 0 35px rgba(168,85,247,0.35))
                  drop-shadow(0 0 15px rgba(34,211,238,0.2)) !important;
          transform: scale(1.025) translateY(-4px);
        }

        /* Glow ring swells */
        .hero-illus-root:hover .illus-glow-ring {
          background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(168,85,247,0.14) 50%, transparent 70%) !important;
          transform: scale(1.1);
        }

        /* Face card border shimmer */
        .hero-illus-root:hover .face-card {
          animation: shimmerBorder 1.4s ease-in-out infinite !important;
        }

        /* Inner glow ring appears */
        .hero-illus-root:hover .face-card-inner-glow {
          stroke: rgba(99,102,241,0.3) !important;
          transition: stroke 0.3s;
        }

        /* Corner brackets pulse cyan */
        .hero-illus-root:hover .bracket {
          animation: bracketCyan 0.9s ease-in-out infinite !important;
        }

        /* Glitch strips fire */
        .hero-illus-root:hover .glitch-strip.s1 {
          animation: glitchSlide1 2.4s ease-in-out infinite !important;
        }
        .hero-illus-root:hover .glitch-strip.s2 {
          animation: glitchSlide2 2.4s ease-in-out infinite 0.5s !important;
        }
        .hero-illus-root:hover .glitch-strip.s3 {
          animation: glitchSlide3 2.4s ease-in-out infinite 1s !important;
        }

        /* Nodes bloom cyan */
        .hero-illus-root:hover .node-dot {
          animation: nodeBloom 0.7s ease-in-out infinite !important;
          filter: url(#nodeBloom);
        }
        .hero-illus-root:hover .node-ring {
          stroke: rgba(34,211,238,0.55) !important;
          transition: stroke 0.3s;
        }

        /* Mesh lines brighten */
        .hero-illus-root:hover .mesh-line {
          stroke: rgba(99,102,241,0.45) !important;
          transition: stroke 0.3s;
        }

        /* FAKE box dashes sprint */
        .hero-illus-root:hover .fake-box {
          stroke: rgba(239,68,68,1) !important;
          stroke-width: 2.2px !important;
          animation: dashMove 0.6s linear infinite !important;
        }

        /* Scan sweeps 2.5× faster */
        .hero-illus-root:hover .scan-sweep {
          animation: scanSweepFast 1.1s ease-in-out infinite !important;
        }
        .hero-illus-root:hover .scan-flash {
          animation: scanFlash 1.1s ease-in-out infinite !important;
        }

        /* Radar rings speed up */
        .hero-illus-root:hover .radar-ring {
          animation-duration: 1s !important;
          stroke: rgba(99,102,241,0.3) !important;
        }

        /* Orbit dots race */
        .hero-illus-root:hover .orbit-dot {
          animation-duration: 2.5s !important;
        }
        .hero-illus-root:hover .orbit-ring {
          stroke: rgba(99,102,241,0.2) !important;
          transition: stroke 0.3s;
        }

        /* Verdict card border red pulse */
        .hero-illus-root:hover .verdict-card {
          animation: verdictRedPulse 0.9s ease-in-out infinite !important;
          filter: url(#cardGlow);
        }
        .hero-illus-root:hover .alert-circle {
          fill: rgba(239,68,68,0.35) !important;
          transition: fill 0.3s;
        }

        /* Chips float faster + glow */
        .hero-illus-root:hover .chip {
          animation-duration: 1.6s !important;
        }
        .hero-illus-root:hover .chip-rect {
          filter: url(#cardGlow);
        }

        /* Face silhouette glows */
        .hero-illus-root:hover .face-silhouette {
          fill: rgba(99,102,241,0.16) !important;
          stroke: rgba(99,102,241,0.5) !important;
          transition: all 0.4s;
        }

        /* Eyes light up cyan */
        .hero-illus-root:hover .eye-left,
        .hero-illus-root:hover .eye-right {
          stroke: rgba(34,211,238,0.85) !important;
          stroke-width: 1.8px !important;
          transition: all 0.3s;
        }
        .hero-illus-root:hover .pupil-left,
        .hero-illus-root:hover .pupil-right {
          fill: rgba(34,211,238,0.65) !important;
          transition: fill 0.3s;
        }

        /* Mouth brightens */
        .hero-illus-root:hover .mouth {
          stroke: rgba(99,102,241,0.75) !important;
          stroke-width: 2px !important;
          transition: all 0.3s;
        }

        /* Grid brightens subtly */
        .hero-illus-root:hover .grid-line {
          stroke: rgba(99,102,241,0.16) !important;
          transition: stroke 0.4s;
        }
      `}</style>
    </div>
  );
}