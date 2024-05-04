import gql from "graphql-tag";
import mongoose from "mongoose";
import "../db.js";
import ConversationModel from "../models/Conversation.model.js";
import MessageModel from "../models/Message.model.js";
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
    getPostByAuthorId(_id: String!): User!
    getConversations(_id: String!): [Conversations!]
    getConversation(_id1: String!, _id2: String!): Conversation
    getMessages(conversationId: String!): [Message!]
    getUser(_id: String!): User
  }

  type Mutation {
    signIn(
      email: String!
      googleId: String
      picture: String!
      name: String!
    ): UserSignedIn!
    addPost(
      post: String!
      photo: String
      email: String!
      tags: [TagInput!]
    ): Post!
    likeDislikePost(id: String!, email: String!): likeDislikePost!
    followUnfollow(by: String!, to: String!): follow!
    comment(id: String!, email: String!, comment: String!): [Comment!]
    editPost(id: String!, _id: String!, post: String!): Post!
    deletePost(id: String!, _id: String!): Boolean!
    createConversation(members: [String!]): Conversation!
    sendMessage(
      conversationId: String!
      sender: String!
      text: String!
    ): Message!
  }

  type Conversation {
    _id: String!
    members: [String!]
    lastMessage: String!
    lastMessageTime: String!
    lastMessageSender: String!
    isSeen: Boolean!
  }

  type Message {
    _id: String!
    conversationId: String!
    sender: String!
    text: String!
  }

  type Conversations {
    members: [String!]
    lastMessage: String!
    lastMessageTime: String!
    lastMessageSender: String!
    isSeen: Boolean!
    user1: User!
    user2: User!
  }

  type follow {
    follow: Boolean!
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
    _id: String!
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
    tags: [Tag!]
    location: String!
    approved: Boolean!
    name: String!
    authorPhoto: String!
    category: String!
  }
  type Tag {
    label: String!
    value: String!
  }
  input TagInput {
    label: String!
    value: String!
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
        return "none";
      }
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);

      if (verify) {
        return "valid";
      } else {
        return "invalid";
      }
    },
    getAllPosts: async (_, { limit, pageNumber }, context) => {
      const postsLength = await PostModel.find({}).countDocuments();
      const posts = await PostModel.find({})
        .sort({
          createdAt: -1,
        })
        .skip((parseInt(pageNumber) - 1) * parseInt(limit))
        .limit(parseInt(limit));
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
    getPostByAuthorId: async (_, { _id }, context) => {
      const user = await UserModel.findOne({
        _id: new mongoose.Types.ObjectId(_id),
      })
        .populate({
          path: "posts",
          options: { sort: { createdAt: -1 } },
        })
        .populate({
          path: "follows",
        })
        .populate({
          path: "followed_by",
        });
      // const posts = await PostModel.find({ author: user._id }).sort({
      //   createdAt: -1,
      // });
      return user._doc;
    },
    getPostById: async (_, { id }, context) => {
      const post = await PostModel.findOne({ _id: id });
      return post;
    },
    getUser: async (_, { _id }, context) => {
      const user = await UserModel.findById(_id);
      if (!user) return null;
      return user;
    },
    getConversations: async (_, { _id }, context) => {
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (!verify) return null;
      const conversations = await ConversationModel.aggregate([
        {
          $match: {
            members: { $in: [new mongoose.Types.ObjectId(_id)] },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members.0",
            foreignField: "_id",
            as: "user1",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members.1",
            foreignField: "_id",
            as: "user2",
          },
        },
        {
          $project: {
            members: 1,
            lastMessage: 1,
            lastMessageTime: 1,
            lastMessageSender: 1,
            isSeen: 1,
            user1: { $arrayElemAt: ["$user1", 0] },
            user2: { $arrayElemAt: ["$user2", 0] },
          },
        },
      ]);
      return conversations;
    },
    getConversation: async (_, { _id1, _id2 }, context) => {
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (!verify) return null;

      const conversation = await ConversationModel.findOne({
        members: { $all: [_id1, _id2] },
      });
      if (!conversation) return null;
      if (conversation.lastMessageSender.toString() !== _id2) {
        conversation.isSeen = true;
        await conversation.save();
      }

      return conversation;
    },
    getMessages: async (_, { conversationId }, context) => {
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (!verify) return null;
      const messages = await MessageModel.find({ conversationId });
      return messages;
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
        // user.picture = picture;
        // await user.save();
        const token = generateJWT({ email: email });
        return { token, _id: user._id };
      }
    },
    addPost: async (_, { post, photo = "", email, tags }, context) => {
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
            tags,
          });
          user.posts.push(newPost._id);
          await newPost.save();
          await user.save();
          return newPost._doc;
        } else {
          return null;
        }
      }
    },
    likeDislikePost: async (_, { id, email }, context) => {
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
    followUnfollow: async (_, { by, to }, context) => {
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (verify) {
        const userBy = await UserModel.findOne({
          _id: new mongoose.Types.ObjectId(by),
        });
        const userTo = await UserModel.findOne({
          _id: new mongoose.Types.ObjectId(to),
        });
        if (userBy && userTo) {
          if (userBy.follows.includes(userTo._id)) {
            const user = await UserModel.findOneAndUpdate(
              { _id: userBy._id },
              { $pull: { follows: userTo._id } },
              { new: true }
            );
            const user2 = await UserModel.findOneAndUpdate(
              { _id: userTo._id },
              { $pull: { followed_by: userBy._id } },
              { new: true }
            );

            return {
              follow: false,
            };
          } else {
            const user = await UserModel.findOneAndUpdate(
              { _id: userBy._id },
              { $push: { follows: userTo._id } },
              { new: true }
            );
            const user2 = await UserModel.findOneAndUpdate(
              { _id: userTo._id },
              { $push: { followed_by: userBy._id } },
              { new: true }
            );

            return {
              follow: true,
            };
          }
        } else {
          return null;
        }
      }
    },
    comment: async (_, { id, email, comment }, context) => {
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
            return updatedPost._doc.comments;
          }
        } else {
          return null;
        }
      }
    },
    editPost: async (_, { id, _id, post }, context) => {
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (verify) {
        const postFound = await PostModel.findOne({ _id: id });

        if (postFound.author.toString() === _id) {
          const updatedPost = await PostModel.findOneAndUpdate(
            { _id: id },
            { $set: { post } },
            { new: true }
          );
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
    createConversation: async (_, { members }, context) => {
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (!verify) return null;
      const conversation = await ConversationModel.findOne({
        members: { $all: members },
      });
      if (conversation) return conversation;
      const newConversation = new ConversationModel({
        members,
      });
      await newConversation.save();
      return newConversation;
    },
    sendMessage: async (_, { conversationId, sender, text }, context) => {
      const verify = verifyJWT(context.headers.authorization.split(" ")[1]);
      if (!verify) return null;
      const newMessage = new MessageModel({
        conversationId,
        sender,
        text,
      });
      const conversation = await ConversationModel.findById(conversationId);
      conversation.lastMessage = text;
      conversation.lastMessageTime = new Date();
      conversation.lastMessageSender = sender;
      conversation.isSeen = false;
      Promise.all([conversation.save(), newMessage.save()]);

      return newMessage;
    },
  },
};
