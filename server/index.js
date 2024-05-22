// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@apollo/server/express4";
// import cors from "cors";
// import express from "express";
// import { resolvers, typeDefs } from "./graphql/graphql.js";
// const port = 4000;
// const app = express();
// app.use(
//   cors({
//     origin: "*",
//   })
// );
// app.use(express.json());

// const server = new ApolloServer({
//   typeDefs: typeDefs,
//   resolvers: resolvers,
// });
// const context = ({ req }) => {
//   return req;
// };
// await server.start();
// app.use(
//   "/graphql",
//   cors({
//     origin: "*",
//   }),
//   expressMiddleware(server, {
//     context,
//   })
// );
// app.get("/hello", (req, res) => {
//   res.json({ hello: "hello" });
// });
// app.listen({ port }, () => {
//   console.log(`Express Server running at http://localhost:${port} 🚀`);
//   console.log(`GraphQL Server running at http://localhost:${port}/graphql 🚀`);
// });

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { resolvers, typeDefs } from "./graphql/graphql.js";
const port = process.env.PORT || 4000;
const app = express();

dotenv.config();
const cors_origin = [process.env.LOCAL, process.env.PRODUCTION];
app.use(cors({ origin: cors_origin }));
app.use(express.json());
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

const context = ({ req }) => {
  return req;
};

await server.start();

app.use(
  "/graphql",
  cors({ origin: cors_origin }),
  expressMiddleware(server, { context })
);

const io = new Server(httpServer, {
  cors: {
    origin: cors_origin,
  },
});

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    socket.userId = userId;
    io.emit("online-users", onlineUsers);
  });

  socket.on("send-message", ({ message, to, from }, ack) => {
    const toSocketId = onlineUsers[to];
    if (toSocketId) {
      socket
        .to(toSocketId)
        .emit("receive-message", { text: message, sender: from });
      ack({ success: true });
    }
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.userId];
    io.emit("online-users", onlineUsers);
    console.log("User disconnected");
  });
});

app.get("/hello", (req, res) => {
  res.json({ hello: "hello" });
});

httpServer.listen(port, () => {
  console.log(`Express Server running at http://localhost:${port} 🚀`);
  console.log(`GraphQL Server running at http://localhost:${port}/graphql 🚀`);
});
