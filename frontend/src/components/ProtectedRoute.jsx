// src/components/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ children, onOpenModal }) {
  const { user } = useAuth();
  useEffect(() => { if (!user) onOpenModal("login"); }, [user]);
  if (!user) return (
    <div className="relative z-10 min-h-screen flex items-center justify-center">
      <p className="text-[#64748b] text-sm">Please sign in to continue.</p>
    </div>
  );
  return children;
}