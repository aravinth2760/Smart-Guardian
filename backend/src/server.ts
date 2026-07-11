import http from "http";
import app from "./app.js";
import { initSocket } from "./socket.js";
import { connectDb } from "./prisma/client.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDb();

    const server = http.createServer(app);

    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
