// src/state/useAuth.js
import { useContext } from "react";
import { AuthContext } from "./auth-context.js";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
