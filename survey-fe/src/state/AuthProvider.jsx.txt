// src/state/AuthProvider.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../utils/api.js";
import { AuthContext } from "./auth-context.js";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("access_token") || "");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("auth_user") || "null"); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    const run = async () => {
      if (!token) { setUser(null); setLoading(false); return; }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        localStorage.setItem("auth_user", JSON.stringify(res.data));
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
        setUser(null);
        setToken("");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  const login = async (email, password) => {
    const r = await api.post("/auth/login", { email, password });
    const t = r.data?.accessToken || "";
    localStorage.setItem("access_token", t);
    setToken(t);
    return true;
  };

  const register = async ({ username, email, password }) => {
    await api.post("/auth/register", { username, email, password });
    await login(email, password);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_user");
    setToken("");
    setUser(null);
  };

  const value = useMemo(() => ({
    token, user, loading, login, register, logout
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
