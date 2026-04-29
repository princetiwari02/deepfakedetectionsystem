// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar         from "./components/Navbar";
import AuthModal      from "./components/AuthModal";
import HomePage       from "./pages/HomePage";
import AnalyzePage    from "./pages/AnalyzePage";
import HistoryPage    from "./pages/HistoryPage";
import AboutPage      from "./pages/AboutPage";
import ContactPage    from "./pages/ContactPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [modal, setModal] = useState(null); // "login" | "signup" | null

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute w-[700px] h-[700px] rounded-full bg-[#6366f1] opacity-[0.07] -top-52 -left-52 blur-[130px] animate-[blobFloat1_12s_ease-in-out_infinite]" />
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[#a855f7] opacity-[0.06] -bottom-52 -right-52 blur-[130px] animate-[blobFloat2_15s_ease-in-out_infinite]" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#22d3ee] opacity-[0.05] top-[40%] left-[40%] blur-[130px] animate-[blobFloat1_10s_ease-in-out_infinite_reverse]" />
        </div>

        <Navbar onOpenModal={setModal} />

        <Routes>
          <Route path="/"        element={<HomePage onOpenModal={setModal} />} />
          <Route path="/about"   element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/analyze" element={<ProtectedRoute onOpenModal={setModal}><AnalyzePage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute onOpenModal={setModal}><HistoryPage /></ProtectedRoute>} />
          <Route path="*"        element={<Navigate to="/" />} />
        </Routes>

        {modal && <AuthModal initialMode={modal} onClose={() => setModal(null)} />}
      </BrowserRouter>
    </AuthProvider>
  );
}