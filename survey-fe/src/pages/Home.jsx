import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../state/useAuth";

export default function Home() {
  const [items, setItems] = useState([]);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    api.get("/surveys").then((r) => setItems(r.data));
  }, []);

  return (
    <div className="py-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl2 shadow-soft border border-white/60">
        <div className="absolute inset-0 bg-brand-gradient opacity-70" />
        <div className="relative p-8 md:p-12">
          <div className="inline-flex items-center gap-2 badge mb-3">Khảo sát mới</div>
          <h1 className="text-4xl md:text-5xl font-extrabold max-w-3xl leading-tight">
            Thu thập ý kiến <span className="underline decoration-brand-amber"></span>.
          </h1>
          <p className="mt-3 text-ink/80 max-w-2xl">
            Tạo khảo sát miễn phí, chia sẻ dễ dàng và phân tích kết quả hiệu quả.
          </p>
          <div className="mt-6 flex gap-3">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">Vào bảng điều khiển</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
                <Link to="/register" className="btn btn-outline">Tạo tài khoản</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* List */}
      <h2 className="text-2xl font-bold mt-10 mb-6">Danh sách khảo sát</h2>
      {items.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((s) => (
            <div key={s._id} className="card p-6 transition-all duration-300 hover:shadow-brand hover:-translate-y-1">
              <div className="flex-grow">
                <h3 className="font-bold text-xl text-brand-mint mb-2">{s.title}</h3>
                <p className="text-sm text-ink/70 mb-4">{s.description}</p>
              </div>
              <Link className="btn btn-primary w-full mt-auto" to={`/survey/${s._id}`}>
                Tham gia ngay
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 card">
          <p className="text-ink/60">Hiện tại không có khảo sát nào.</p>
        </div>
      )}
    </div>
  );
}
