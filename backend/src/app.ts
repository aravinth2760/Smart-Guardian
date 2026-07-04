import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Smart Guardian Backend is running 🚀",
  });
});

export default app;
