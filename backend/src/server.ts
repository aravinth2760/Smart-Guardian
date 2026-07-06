import "dotenv/config";

import app from "./app.js";
import { connectDb } from "./prisma/client.js";

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
