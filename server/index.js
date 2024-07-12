import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { resolvers, typeDefs } from "./graphql/graphql.js";
import ConversationModel from "./models/Conversation.model.js";
dotenv.config();
let onlineUsers = {};

const startServer = async () => {
  const port = process.env.PORT || 4000;
  const cors_origin = [process.env.LOCAL, process.env.PRODUCTION];
  const app = express();
  app.use(
    cors({
      origin: cors_origin,
      credentials: true,
    })
  );

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });

  await server.start();
  const injectIoMiddleware = (io) => {
    return (req, res, next) => {
      req.io = io; // Add io to the req object
      next(); // Call the next middleware in the chain
    };
  };
  const io = new Server(httpServer, {
    cors: {
      origin: cors_origin,
    },
  });
  io.onlineUsers = onlineUsers;

  app.use(injectIoMiddleware(io));

  app.use(express.json());

  const context = ({ req }) => {
    return req;
  };

  app.use("/graphql", expressMiddleware(server, { context }));

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join", (userId) => {
      onlineUsers[userId] = socket.id;
      socket.userId = userId;
      io.emit("online-users", onlineUsers);
      io.onlineUsers = onlineUsers;
    });
    socket.on("send-message", async ({ message, to, from, conversationId }) => {
      const toSocketId = onlineUsers[to];
      if (toSocketId) {
        const conversation = await ConversationModel.findById(conversationId);
        socket.to(toSocketId).emit("receive-message", {
          text: message,
          sender: from,
          lastMessageTime: conversation.lastMessageTime,
          lastMessageSender: conversation.lastMessageSender,
          isSeen: conversation.isSeen,
        });
      }
    });
    socket.on("disconnect", () => {
      delete onlineUsers[socket.userId];
      io.emit("online-users", onlineUsers);
      io.onlineUsers = onlineUsers;
      console.log("User disconnected");
    });
  });

  app.get("/hello", (req, res) => {
    res.json({ hello: "hello" });
  });

  httpServer.listen(port, () => {
    console.log(`Express Server running at http://localhost:${port} 🚀`);
    console.log(
      `GraphQL Server running at http://localhost:${port}/graphql 🚀`
    );
  });
};
startServer();
