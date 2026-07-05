import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

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
app.use("/api", routes);

export default app;
