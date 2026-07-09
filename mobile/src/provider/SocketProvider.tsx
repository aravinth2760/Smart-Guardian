import { createContext, useContext, useEffect, ReactNode } from "react";

import { useSelector } from "react-redux";

import { socket } from "@/services/socket";
import { RootState } from "@/store";

type SocketContextType = {
  socket: typeof socket;
};

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (!userId) return;

    socket.connect();

    socket.emit("join-user", userId);

    console.log("Socket connected:", socket.id);

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return context;
}
