import gql from "graphql-tag";
import "../db.js";
import PostModel from "../models/Post.model.js";
import UserModel from "../models/User.model.js";
import { generateJWT, verifyJWT } from "../utils/auth.js";
export const typeDefs = gql`
  type Query {
    hello: String
    tokenizedSignIn: String!
  }
  scalar Date
  enum Role {
    user
    admin
    visitor
  }
  type User {
    name: String!
    email: String!
    picture: String!
    googleId: String!
    cover_picture: String!
    allowed_to_signin: Boolean!
    posts: [Post!]
    follows: [User!]
    followed_by: [User!]
    token: String!
    role: Role!
  }

  type UserSignedIn {
    token: String!
  }

  type Post {
    post: String!
    photo: String!
    author: String!
    likes: [String!]
    dislikes: [String!]
    comments: [String!]
    isPaid: [String!]
    shared_by: [String!]
    time: String!
    tags: [String!]
    location: String!
    approved: Boolean!
  }
  type CreatedPost {
    post: String!
    photo: String
    author: String!
    time: String!
  }
  type Comment {
    comment_by: User!
    comment: String!
    time: String!
  }
  type Mutation {
    addPost(post: String!, photo: String, email: String!): Post!
    signIn(
      email: String!
      googleId: String
      picture: String!
      name: String!
    ): UserSignedIn!
  }
`;

export const resolvers = {
  Query: {
    hello: (_, __, context) => {
      // console.log(context);
      return "hello";
    },
    tokenizedSignIn: (_, __, context) => {
      console.log("yo yo", context.headers.authorization);
      console.log("yo yo verify");
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      console.log(
        "yo yo verify",
        verifyJWT(context.headers.authorization.split(" ")[1])
      );
      if (verify) {
        console.log("token verified");
        return "valid";
      } else {
        console.log("token not verified");
        return "invalid";
      }
    },
  },
  Mutation: {
    signIn: async (_, { name, email, picture, googleId }, context) => {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        const newUser = new UserModel({
          name: name,
          email: email,
          picture: picture,
          googleId: googleId,
        });
        await newUser.save();
        const token = generateJWT({ email: email });
        return { token };
      } else {
        const token = generateJWT({ email: email });
        console.log(token);
        return { token };
      }
    },
    addPost: async (_, { post, photo, email }, context) => {
      console.log("add post");
      // console.log("context", context.headers.authorization);
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (verify) {
        const user = await UserModel.findOne({ email: email });
        if (user) {
          const newPost = new PostModel({
            post: post,
            photo: photo,
            author: user._id,
          });
          await newPost.save();
          return newPost._doc;
        } else {
          return null;
        }
      }
    },
  },
};
