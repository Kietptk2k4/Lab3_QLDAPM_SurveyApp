import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../state/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md card p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6">Đăng Nhập</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input className="w-full bg-white/60 border border-white/80 p-3 rounded-xl2 placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-brand-mint"
              placeholder="nhap@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mật khẩu</label>
            <input className="w-full bg-white/60 border border-white/80 p-3 rounded-xl2 placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-brand-mint"
              type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          {err && <div className="text-red-600 text-sm text-center">{err}</div>}
          <button className="btn btn-primary w-full text-lg">Đăng nhập</button>
        </form>
        <p className="text-sm text-center mt-6 text-ink/70">
          Chưa có tài khoản? <Link to="/register" className="underline">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}
