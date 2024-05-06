"use client";
import { useSocket } from "@/app/components/SocketProvider";
import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const GET_CONVERSATIONS = gql`
  query getConversations($_id: String!) {
    getConversations(_id: $_id) {
      members
      lastMessage
      lastMessageTime
      lastMessageSender
      isSeen
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
  const { socket, onlineUsers } = useSocket();
  const router = useRouter()
  console.log("🚀 ~ Conversations ~ socket:", socket);
  const user = useSelector((state) => state.globalSlice.user);
  const token = useSelector((state) => state.globalSlice.token);
  const [friendsConvo, setFriendsConvo] = useState({});
  const [friendsConvoList, setFriendsConvoList] = useState([]);
  const [needUpdate, setNeedUpdate] = useState(0);
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
      let friends = { ...friendsConvo };
      console.log("firinggg 1", friendsConvo);
      data?.getConversations.forEach((convo) => {
        if (convo.user1._id === user._id) {
          friends[convo.user2._id] = {
            ...convo.user2,
            lastMessage: convo.lastMessage,
            lastMessageTime: convo.lastMessageTime,
            lastMessageSender: convo.lastMessageSender,
            isSeen: convo.isSeen,
            isOnline: false,
          };
        } else {
          friends[convo.user1._id] = {
            ...convo.user1,
            lastMessage: convo.lastMessage,
            lastMessageTime: convo.lastMessageTime,
            lastMessageSender: convo.lastMessageSender,
            isSeen: convo.isSeen,
            isOnline: false,
          };
        }
      });
      console.log("firinggg 2", friends);

      setFriendsConvo(friends);
      setNeedUpdate((prev) => prev + 1);
    }
  }, [data?.getConversations]);

  // useEffect(() => {
  //   socket?.emit("join", user?._id);
  //   socket?.on("online-users", (onlineUser) => {
  //     setOnlineUsers(onlineUser);
  //     console.log(friendsConvo, "🚀 ~ socket?.on ~ onlineUser:", onlineUser);
  //   });
  // }, [socket, user]);
  useEffect(() => {
    console.log("🚀 ~ friendsConvo", friendsConvo);
    if (onlineUsers && Object.keys(friendsConvo).length > 0) {
      let friendOnline = { ...friendsConvo };
      console.log("🚀 ~ useEffect ~ friendOnline:", friendOnline);

      Object.keys(friendOnline).forEach((userId) => {
        if (onlineUsers[userId]) {
          friendOnline[userId].isOnline = true;
        } else {
          friendOnline[userId].isOnline = false;
        }
      });
      setFriendsConvo(friendOnline);
    }
  }, [onlineUsers, needUpdate]);
  useEffect(() => {
    setFriendsConvoList(Object.keys(friendsConvo));
  }, [friendsConvo]);
  console.log(onlineUsers, "🚀 ~ Conversations ~ friendsConvo:", friendsConvo);
  return (
    <div className="mt-8">
      <h1 className="bg-accent py-2 px-2 font-semibold text-xl my-4">
        Conversations
      </h1>
      <div className="space-y-4 px-2 flex flex-col">
        {friendsConvoList.map((friend, ind) => {
          return (
            <button
              key={ind}
              onClick={() => {
                router.push(`/message/${friendsConvo[friend]._id}`);
                // refetch()
              }}
            >
              <Link
                href={`/message/${friendsConvo[friend]._id}`}
                className="flex items-center gap-4 "
              >
                <img
                  className={`w-[30px] h-[30px] rounded-full ${
                    friendsConvo[friend].isOnline &&
                    "outline outline-2 outline-offset-2 outline-green-500"
                  }`}
                  referrerPolicy="no-referrer"
                  src={friendsConvo[friend].picture}
                  alt="profile picture"
                />
                <span
                  className={`bg-sky-500 px-2 #py-2 ${
                    friendsConvo[friend].lastMessageSender !== user?._id &&
                    !friendsConvo[friend].isSeen &&
                    "font-bold"
                  }`}
                >
                  {friendsConvo[friend].name}
                </span>
                {friendsConvo[friend].lastMessageSender !== user?._id &&
                  !friendsConvo[friend].isSeen && (
                    <span className="w-[10px] aspect-square bg-text rounded-full #ml-auto "></span>
                  )}
              </Link>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Conversations;
