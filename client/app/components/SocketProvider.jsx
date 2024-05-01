"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
const SocketContext = createContext();
export const useSocket = () => {
  return useContext(SocketContext);
};
const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO client
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET);
    newSocket?.on("connect", () => {
      console.log("from socket: hello world");
    });
    setSocket(newSocket);

    // Clean up function to close socket connection when component unmounts
    return () => newSocket.close();
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
