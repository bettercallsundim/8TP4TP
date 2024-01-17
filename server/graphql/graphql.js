import gql from "graphql-tag";
import "../db.js";
import PostModel from "../models/Post.model.js";
import UserModel from "../models/User.model.js";
import { generateJWT, verifyJWT } from "../utils/auth.js";
export const typeDefs = gql`
  type Query {
    hello: String
    tokenizedSignIn: String!
    getAllPosts(limit: Int!, pageNumber: Int!): GetAllPosts
    getPostById(id: String!): Post!
    getPostByAuthor(email: String!): [Post!]
  }
  type Mutation {
    signIn(
      email: String!
      googleId: String
      picture: String!
      name: String!
    ): UserSignedIn!
    addPost(post: String!, photo: String, email: String!): Post!
    likeDislikePost(id: String!, email: String!): likeDislikePost!
    comment(id: String!, email: String!, comment: String!): [Comment!]
    editPost(id: String!, _id: String!, post: String!): Post!
    deletePost(id: String!, _id: String!): Boolean!
  }
  type GetAllPosts {
    hasMore: Int!
    posts: [Post!]
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
    _id: String!
  }

  type Post {
    _id: String!
    post: String!
    photo: String!
    author: String!
    likes: [String!]
    dislikes: [String!]
    comments: [Comment!]
    isPaid: [String!]
    shared_by: [String!]
    time: String!
    tags: [String!]
    location: String!
    approved: Boolean!
    name: String!
    authorPhoto: String!
  }
  type CreatedPost {
    post: String!
    photo: String
    author: String!
    time: String!
    name: String!
  }
  type Comment {
    comment_by: String!
    name: String!
    photo: String!
    comment: String!
    time: String!
  }
  type likeDislikePost {
    liked: Boolean!
    post: Post!
  }
`;

export const resolvers = {
  Query: {
    hello: (_, __, context) => {
      return "hello";
    },
    tokenizedSignIn: (_, __, context) => {
      if (!context.headers.authorization.split(" ")[1]) {
        return "invalid";
      }
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);

      if (verify) {
        return "valid";
      } else {
        return "invalid";
      }
    },
    getAllPosts: async (_, { limit, pageNumber }, context) => {
      console.log("hi from getAllPosts", limit, pageNumber);
      const postsLength = await PostModel.find({}).countDocuments();
      const posts = await PostModel.find({})
        .sort({
          createdAt: -1,
        })
        .skip((parseInt(pageNumber) - 1) * parseInt(limit))
        .limit(parseInt(limit));
      console.log(postsLength, "postsLength", postsLength);
      return {
        posts,
        hasMore: postsLength,
      };
    },
    getPostByAuthor: async (_, { email }, context) => {
      const user = await UserModel.findOne({ email });
      const posts = await PostModel.find({ author: user._id }).sort({
        createdAt: -1,
      });
      return posts;
    },
    getPostById: async (_, { id }, context) => {
      const post = await PostModel.findOne({ _id: id });
      return post;
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
        return { token, _id: newUser._id };
      } else {
        user.picture = picture;
        await user.save();
        const token = generateJWT({ email: email });
        return { token, _id: user._id };
      }
    },
    addPost: async (_, { post, photo = "", email }, context) => {
      console.log("add post");

      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (verify) {
        const user = await UserModel.findOne({ email: email });
        if (user) {
          const newPost = new PostModel({
            post: post,
            photo: photo,
            author: user._id,
            name: user.name,
            authorPhoto: user.picture,
          });
          await newPost.save();
          return newPost._doc;
        } else {
          return null;
        }
      }
    },
    likeDislikePost: async (_, { id, email }, context) => {
      console.log("hi from likeDislikePost");
      console.log("context", context.headers.authorization);
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (verify) {
        const user = await UserModel.findOne({ email: email });
        if (user) {
          const post = await PostModel.findOne({ _id: id });
          if (post) {
            if (post.likes.includes(user._id)) {
              const updatedPost = await PostModel.findOneAndUpdate(
                { _id: id },
                { $pull: { likes: user._id } },
                { new: true }
              );
              return {
                liked: false,
                post: updatedPost,
              };
            } else {
              const updatedPost = await PostModel.findOneAndUpdate(
                { _id: id },
                { $push: { likes: user._id } },
                { new: true }
              );
              return {
                liked: true,
                post: updatedPost,
              };
            }
          }
        } else {
          return null;
        }
      }
    },
    comment: async (_, { id, email, comment }, context) => {
      console.log("hi from comment");
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (verify) {
        const user = await UserModel.findOne({ email: email });
        if (user) {
          const post = await PostModel.findOne({ _id: id });
          if (post) {
            const newComment = {
              comment_by: user._id,
              comment,
              name: user.name,
              photo: user.picture,
            };
            const updatedPost = await PostModel.findOneAndUpdate(
              { _id: id },
              { $push: { comments: newComment } },
              { new: true }
            );
            console.log("comment success");
            return updatedPost._doc.comments;
          }
        } else {
          return null;
        }
      }
    },
    editPost: async (_, { id, _id, post }, context) => {
      console.log("hi from edit post");

      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (verify) {
        const postFound = await PostModel.findOne({ _id: id });
        console.log("hi from edit post too", _id);
        console.log("hi from edit post too", postFound.author);

        if (postFound.author.toString() === _id) {
          const updatedPost = await PostModel.findOneAndUpdate(
            { _id: id },
            { $set: { post } },
            { new: true }
          );
          console.log("post edit success");
          return updatedPost._doc;
        }
      } else {
        return null;
      }
    },
    deletePost: async (_, { id, _id }, context) => {
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (verify) {
        const postFound = await PostModel.findOne({ _id: id });
        console.log("post delete success", postFound.author.toString(), _id);
        if (postFound.author.toString() === _id) {
          await PostModel.findOneAndDelete({ _id: id });
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
};
