import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/auth.js";
const router = Router();

router.post("/register", async (req,res)=>{
  const { username, email, password } = req.body;
  if(!username || !email || !password) return res.status(400).json({message:"Missing fields"});
  const exists = await User.findOne({ $or:[{email},{username}] });
  if(exists) return res.status(400).json({message:"Email/username exists"});
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password:hash });
  res.status(201).json({ _id:user._id, username, email, role:user.role });
});

router.post("/login", async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({message:"Invalid credentials"});
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({message:"Invalid credentials"});
  const accessToken = jwt.sign({ _id:user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn:"7d" });
  res.json({ accessToken });
});

router.get("/me", requireAuth, async (req,res)=>{
  const user = await User.findById(req.user._id).lean();
  res.json({ _id:user._id, username:user.username, email:user.email, role:user.role });
});

export default router;
