import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import quoteRoutes from "./routes/quotes.js";
import authRoutes from "./routes/authRoute.js";

// 1. Config
dotenv.config();
connectDB();

const app = express();

// 2. Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, 
  }),
);

// 3. Mount Routes
app.use("/api/auth", authRoutes); 
app.use("/api/quotes", quoteRoutes);

// 4. Health Check
app.get("/", (req, res) => {
  res.send("Procurement Engine API is Running...");
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
