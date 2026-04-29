// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  const signup = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    setUser({ ...cred.user, displayName: name });
    return cred;
  };

  const login          = (e, p) => signInWithEmailAndPassword(auth, e, p);
  const loginWithGoogle= ()    => signInWithPopup(auth, new GoogleAuthProvider());
  const logout         = ()    => signOut(auth);
  const getToken       = ()    => user?.getIdToken() ?? null;

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout, getToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);