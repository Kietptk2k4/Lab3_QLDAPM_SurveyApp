import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();
  const load = () => api.get("/surveys/mine").then((r) => setItems(r.data));

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khảo sát này không? Thao tác này không thể hoàn tác.")) return;
    await api.delete(`/surveys/${id}`);
    load();
  };

  return (
    <div className="min-h-[80vh]">
      <header className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Bảng điều khiển</h1>
          <p className="text-ink/70">Quản lý các khảo sát của bạn.</p>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/" className="btn">Trang chủ</Link>
          <button className="btn btn-primary" onClick={() => nav("/builder")}>
            Tạo khảo sát mới
          </button>
        </nav>
      </header>

      <main>
        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((s) => (
              <div key={s._id} className="card p-6 hover:shadow-brand transition-all duration-300">
                <div>
                  <div className="font-bold text-xl text-brand-mint mb-2">{s.title}</div>
                  <div className={`text-xs font-semibold py-1 px-2 rounded-full inline-block mb-4 ${
                    s.status === 'active' ? 'bg-green-500/20 text-green-700' : 'bg-gray-400/20 text-gray-700'
                  }`}>
                    Trạng thái: {s.status}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button className="flex-1 btn btn-outline" onClick={() => nav(`/builder/${s._id}`)}>Sửa ✏️</button>
                  <Link className="flex-1 btn" to={`/survey/${s._id}/results`}>Kết quả 📊</Link>
                  <button className="btn" onClick={() => del(s._id)}>Xóa 🗑️</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card mt-8">
            <h2 className="text-xl font-semibold mb-2">Bạn chưa tạo khảo sát nào</h2>
            <p className="text-ink/70 mb-6">Hãy bắt đầu tạo một khảo sát mới ngay bây giờ.</p>
            <button className="btn btn-primary" onClick={() => nav("/builder")}>Tạo khảo sát đầu tiên</button>
          </div>
        )}
      </main>
    </div>
  );
}
