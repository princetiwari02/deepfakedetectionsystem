/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        cabinet: ["'Cabinet Grotesk'", "sans-serif"],
        dm: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        bg:       "#05070f",
        surface:  "#0d1120",
        surface2: "#111827",
        accent:   "#6366f1",
        accent2:  "#22d3ee",
        accent3:  "#a855f7",
      },
      animation: {
        "pulse-dot":     "pulseDot 2s ease-in-out infinite",
        "fade-up":       "fadeUp 0.5s ease both",
        "spin-slow":     "spin 0.8s linear infinite",
        "blob-float-1":  "blobFloat1 12s ease-in-out infinite",
        "blob-float-2":  "blobFloat2 15s ease-in-out infinite",
        "border-rotate": "borderRotate 3s linear infinite",
        "icon-float":    "iconFloat 2s ease-in-out infinite",
        "particle-rise": "particleRise 1.5s ease-in-out infinite",
      },
      keyframes: {
        pulseDot: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%":     { opacity: "0.5", transform: "scale(0.75)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        blobFloat1: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(30px,-20px) scale(1.03)" },
          "66%":     { transform: "translate(-20px,15px) scale(0.97)" },
        },
        blobFloat2: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(-25px,20px) scale(1.05)" },
          "66%":     { transform: "translate(15px,-10px) scale(0.96)" },
        },
        borderRotate: {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        iconFloat: {
          "0%,100%": { transform: "translateY(0) scale(1)" },
          "50%":     { transform: "translateY(-6px) scale(1.08)" },
        },
        particleRise: {
          "0%":   { opacity: "0", transform: "translateY(20px) scale(0)" },
          "50%":  { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(-30px) scale(1.5)" },
        },
      },
    },
  },
  plugins: [],
}