import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/useAuth.js";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.email || !form.password) return setError("Vui lòng nhập đủ thông tin.");
    if (form.password.length < 6) return setError("Mật khẩu tối thiểu 6 ký tự.");
    if (form.password !== form.confirm) return setError("Mật khẩu nhập lại không khớp.");
    try {
      await register({ username: form.username.trim(), email: form.email.trim(), password: form.password });
      nav("/");
    } catch (e) {
      setError(e?.response?.data?.message || "Đăng ký thất bại.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md card p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6">Tạo Tài Khoản</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          {["username","email","password","confirm"].map((k, idx) => (
            <div key={k}>
              <label className="block text-sm font-medium mb-2">
                {idx===0?"Tên người dùng":idx===1?"Email":idx===2?"Mật khẩu":"Nhập lại mật khẩu"}
              </label>
              <input
                className="w-full bg-white/60 border border-white/80 p-3 rounded-xl2 placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-brand-mint"
                type={k.includes("password") ? "password":"text"}
                placeholder={k==="username"?"Tên của bạn":k==="email"?"nhap@email.com":"••••••••"}
                value={form[k]}
                onChange={(e)=>setForm({ ...form, [k]: e.target.value })}
              />
            </div>
          ))}
          {error && <div className="text-red-600 text-sm text-center py-2">{error}</div>}
          <button className="btn btn-primary w-full text-lg mt-2">Tạo tài khoản</button>
        </form>
        <p className="text-sm text-center mt-6 text-ink/70">
          Đã có tài khoản? <Link to="/login" className="underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
