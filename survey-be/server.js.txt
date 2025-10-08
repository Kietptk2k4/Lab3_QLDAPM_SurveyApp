import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.routes.js";
import surveyRoutes from "./src/routes/survey.routes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

// --- CORS an toàn với credentials ---
const origins = (process.env.ALLOW_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
// Nếu bạn cần gửi cookie/cred, KHÔNG dùng "*"
app.use(cors({
  origin: origins.length ? origins : true,   // true = reflect origin (không phải "*")
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

// Debug nhỏ: kiểm tra ENV đã nạp chưa (đừng in password thật)
console.log("ENV check:", {
  hasMongo: !!process.env.MONGODB_URI,
  allowOrigin: process.env.ALLOW_ORIGIN
});

app.get("/", (req, res) => res.send("API OK"));

// Mount routes
app.use("/auth", authRoutes);
app.use("/surveys", surveyRoutes);

// 404 JSON (đỡ bị "Cannot POST /..."):
app.use((req, res) => res.status(404).json({ message: "Not found", path: req.originalUrl }));

const PORT = process.env.PORT || 8080;

// Bắt lỗi kết nối DB rõ ràng:
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log("🚀 API running on", PORT));
  })
  .catch(err => {
    console.error("❌ DB connect error:", err?.message || err);
    process.exit(1);
  });
