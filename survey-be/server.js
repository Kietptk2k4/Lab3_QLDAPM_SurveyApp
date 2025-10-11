import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.routes.js";
import surveyRoutes from "./src/routes/survey.routes.js";
import * as AWSXRay from "aws-xray-sdk";   // << ESM import

import dotenv from "dotenv";
dotenv.config();

const app = express();

// Sampling rule (tuỳ bạn tinh chỉnh)
AWSXRay.middleware.setSamplingRules({
  version: 2,
  rules: [
    {
      description: "default",
      service_name: "survey-be",
      http_method: "*",
      url_path: "*",
      fixed_target: 1,
      rate: 0.1,
    },
  ],
  default: { fixed_target: 1, rate: 0.05 },
});

// MỞ segment TRƯỚC routes
app.use(AWSXRay.express.openSegment("survey-be"));

// CORS
const origins = (process.env.ALLOW_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins.length ? origins : true, // true = reflect origin (hợp lệ khi credentials=true)
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Health & test
app.get("/", (req, res) => res.send("API OK"));
app.get("/healthz", (req, res) => res.status(200).send("ok"));
app.get("/__test500", (req, res) => res.status(500).json({ error: "synthetic-500" }));

// Routes chính
app.use("/auth", authRoutes);
app.use("/surveys", surveyRoutes);

// 404 JSON
app.use((req, res) => res.status(404).json({ message: "Not found", path: req.originalUrl }));

// ĐÓNG segment SAU TẤT CẢ routes/handlers
app.use(AWSXRay.express.closeSegment());

const PORT = process.env.PORT || 80;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log("🚀 API running on", PORT));
  })
  .catch((err) => {
    console.error("❌ DB connect error:", err?.message || err);
    process.exit(1);
  });
