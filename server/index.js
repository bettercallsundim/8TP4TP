import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { resolvers, typeDefs } from "./graphql/graphql.js";
const port = 4000;
const app = express();
app.use(
  cors({
    origin: ["https://food-o-graphy.vercel.app", "http://localhost:3000"],
  })
);
app.use(express.json());

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
  cors({
    origin: ["https://food-o-graphy.vercel.app", "http://localhost:3000"],
  }),
  expressMiddleware(server, {
    context,
  })
);
app.get("/hello", (req, res) => {
  res.json({ hello: "hello" });
});
app.listen({ port }, () => {
  console.log(`Express Server running at http://localhost:${port} 🚀`);
  console.log(`GraphQL Server running at http://localhost:${port}/graphql 🚀`);
});
