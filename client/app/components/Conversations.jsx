"use client";
import { useSocket } from "@/app/components/SocketProvider";
import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const GET_CONVERSATIONS = gql`
  query getConversations($_id: String!) {
    getConversations(_id: $_id) {
      members
      user1 {
        _id
        email
        name
        picture
      }
      user2 {
        _id
        email
        name
        picture
      }
    }
  }
`;
const Conversations = () => {
  const socket = useSocket();
  const user = useSelector((state) => state.globalSlice.user);
  const token = useSelector((state) => state.globalSlice.token);
  const [friendsConvo, setFriendsConvo] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_CONVERSATIONS, {
    onError: (err) => {
      console.log(err);
    },
    variables: {
      _id: user?._id,
    },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user]);
  useEffect(() => {
    if (data?.getConversations) {
      let friends = {};
      data?.getConversations.forEach((convo) => {
        if (convo.user1._id === user._id) {
          friends[convo.user2._id] = { ...convo.user2, isOnline: false };
        } else {
          friends[convo.user1._id] = { ...convo.user1, isOnline: false };
        }
      });
      setFriendsConvo(friends);
    }
  }, [data]);

  useEffect(() => {
    socket?.emit("join", user?._id);
    socket?.on("online-users", (onlineUser) => {
      setOnlineUsers(onlineUser);
      console.log(friendsConvo, "🚀 ~ socket?.on ~ onlineUser:", onlineUser);
    });
  }, [socket, user]);
  useEffect(() => {
    console.log("🚀 ~ friendsConvo", friendsConvo);
    if (onlineUsers) {
      let friendOnline = { ...friendsConvo };

      Object.keys(friendOnline).forEach((userId) => {
        if (onlineUsers[userId]) {
          friendOnline[userId].isOnline = true;
        } else {
          friendOnline[userId].isOnline = false;
        }
      });
      setFriendsConvo(friendOnline);
    }
  }, [onlineUsers]);

  console.log("🚀 ~ Conversations ~ data:", data, error);
  return (
    <div>
      Conversations
      <div>
        {Object.keys(friendsConvo).map((friend) => {
          return (
            <Link
              href={`/message/${friendsConvo[friend]._id}`}
              className="flex items-center gap-4"
            >
              <img
                className={`w-[20px] h-[20px] rounded-full ${
                  friendsConvo[friend].isOnline && "ring-2 ring-green-500"
                }`}
                referrerPolicy="no-referrer"
                src={friendsConvo[friend].picture}
                alt="profile picture"
              />
              <span>{friendsConvo[friend].name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Conversations;
