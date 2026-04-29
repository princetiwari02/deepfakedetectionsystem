// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="relative z-10 max-w-[1100px] mx-auto px-6 py-9 flex items-center justify-between flex-wrap gap-4 border-t border-white/5">
      <div className="flex items-center gap-2 font-cabinet font-extrabold text-white text-[0.95rem]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] shadow-[0_0_14px_#22d3ee] animate-[pulseDot_2s_ease-in-out_infinite]" />
        DeepGuard <span className="text-[#22d3ee] ml-1">AI</span>
      </div>
      <div className="text-xs text-[#64748b]">© 2025 DeepGuard AI. Built for academic &amp; research use.</div>
    </footer>
  );
}