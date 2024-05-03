"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext();
export const useSocket = () => {
  return useContext(SocketContext);
};
const SocketProvider = ({ children }) => {
  const user = useSelector((state) => state.globalSlice.user);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);

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
  useEffect(() => {
    socket?.emit("join", user?._id);
    socket?.on("online-users", (onlineUser) => {
      setOnlineUsers(onlineUser);
    });
  }, [socket, user]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers, setOnlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
