import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Builder from "./pages/Builder.jsx";
import TakeSurvey from "./pages/TakeSurvey.jsx";
import Results from "./pages/Results.jsx";
import { useAuth } from "./state/useAuth.js";

const Private = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-brand-ice text-ink">
      {/* Top Accent */}
      <div className="h-1 w-full bg-brand-gradient" />

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-white/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg">
            <span className="h-7 w-7 rounded-full" style={{ backgroundImage:'linear-gradient(135deg,#33FFCC,#99FFFF)' }} />
            <span>Survey App</span>
          </Link>
          <nav className="flex items-center gap-4">
            {!user ? (
              <>
                <Link className="btn btn-outline" to="/login">Đăng nhập  </Link>
                <Link className="btn btn-primary" to="/register">Đăng ký</Link>
              </>
            ) : (
              <>
                <span className="hidden sm:inline text-base">Xin chào, <b>{user.username}</b></span>
                <Link className="btn btn-outline" to="/dashboard">Bảng điều khiển</Link>
                <button className="btn" onClick={logout}>Đăng xuất</button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Private><Dashboard/></Private>} />
          <Route path="/builder/:id?" element={<Private><Builder/></Private>} />
          <Route path="/survey/:id" element={<TakeSurvey/>} />
          <Route path="/survey/:id/results" element={<Private><Results/></Private>} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-ink/60">
        © {new Date().getFullYear()} Survey App  | Built with ❤️ by Nhom15
      
      </footer>
    </div>
  );
}
