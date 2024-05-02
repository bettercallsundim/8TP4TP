"use client";
import LeftSidebar from "@/app/components/LeftSidebar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useSocket } from "@/app/components/SocketProvider";
import { gql, useMutation, useQuery } from "@apollo/client";
const GET_USER = gql`
  query getUser($_id: String!) {
    getUser(_id: $_id) {
      name
      picture
    }
  }
`;
const GET_CONVERSATION = gql`
  query getConversation($_id1: String!, $_id2: String!) {
    getConversation(_id1: $_id1, _id2: $_id2) {
      _id
      members
    }
  }
`;
const GET_MESSAGES = gql`
  query getMessages($conversationId: String!) {
    getMessages(conversationId: $conversationId) {
      _id
      text
      sender
    }
  }
`;
const CREATE_CONVERSATION = gql`
  mutation createConversation($members: [String!]) {
    createConversation(members: $members) {
      _id
    }
  }
`;
const SEND_MESSAGE = gql`
  mutation sendMessage(
    $conversationId: String!
    $sender: String!
    $text: String!
  ) {
    sendMessage(conversationId: $conversationId, sender: $sender, text: $text) {
      _id
    }
  }
`;
const Message = ({ params: { id } }) => {
  const user = useSelector((state) => state.globalSlice.user);
  const token = useSelector((state) => state.globalSlice.token);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const msgRef = useRef(null);
  const socket = useSocket();
  const {
    loading: userLoading,
    error: userError,
    data: userData,
    refetch: userRefetch,
  } = useQuery(GET_USER, {
    onError: (err) => {
      console.log(err);
    },
    variables: {
      _id: id,
    },
  });
  console.log("🚀 ~ Message ~ userData:", userData);
  const { loading, error, data, refetch } = useQuery(GET_CONVERSATION, {
    onError: (err) => {
      console.log(err);
    },
    variables: {
      _id1: id,
      _id2: user?._id,
    },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  const {
    loading: getMessagesLoading,
    error: getMessagesError,
    data: getMessagesData,
    refetch: getMessagesRefetch,
  } = useQuery(GET_MESSAGES, {
    onError: (err) => {
      console.log(err);
    },
    variables: {
      conversationId,
    },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  const [
    createConversation,
    { error: createConversationError, loading: createConversationLoading },
  ] = useMutation(CREATE_CONVERSATION, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  const [
    sendMessage,
    { error: sendMessageError, loading: sendMessageLoading },
  ] = useMutation(SEND_MESSAGE, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });

  async function sendMsg() {
    if (data?.getConversation === null) {
      createConversation({
        variables: {
          members: [id, user?._id],
        },
        update: (cache, data) => {
          if (data?.data?.createConversation?._id) {
            sendMessage({
              variables: {
                conversationId: data?.data?.createConversation?._id,
                sender: user?._id,
                text: message,
              },
              update: (cache, data) => {},
            });
          }
        },
      });
    } else {
      sendMessage({
        variables: {
          conversationId: conversationId,
          sender: user?._id,
          text: message,
        },
        update: (cache, data) => {},
      });
    }
    socket?.emit("send-message", { message, to: id, from: user?._id });
    setMessage("");
    setMessages((prev) => [...prev, { text: message, sender: user?._id }]);
  }
  useEffect(() => {
    if (user?._id) {
      refetch();
    }
  }, [user]);
  useEffect(() => {
    if (data?.getConversation?._id) {
      setConversationId(data?.getConversation?._id);
    }
  }, [data]);

  useEffect(() => {
    if (conversationId) {
      getMessagesRefetch();
    }
  }, [conversationId]);
  useEffect(() => {
    if (getMessagesData?.getMessages) setMessages(getMessagesData?.getMessages);
  }, [getMessagesData]);
  useEffect(() => {
    // socket?.on("connect", () => {
    //   console.log("from socket: hello world");
    // });
    
    socket?.on("receive-message", (msg) => {
      console.log("🚀 ~ socket?.on ~ msg:", msg);
      setMessages((prev) => [...prev, msg]);
    });
  }, [socket]);
  useEffect(() => {
    msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [messages]);
  return (
    <div className="bg-bng text-text py-8 px-4 md:px-12 flex items-start md:h-[90vh] w-full overflow-hidden ">
      <div className="hidden md:block">
        <LeftSidebar />
      </div>
      <div className="hidescroll #overflow-y-scroll h-full w-full ">
        {/* ////user details */}
        <div className="user-details shadow-lg px-8 py-4">
          <div className="flex items-center">
            <img
              src={userData?.getUser?.picture}
              alt=""
              className="w-12 h-12 rounded-full"
            />
            <h1 className="text-xl ml-2">{userData?.getUser?.name}</h1>
          </div>
        </div>
        <div ref={msgRef} className="messages h-[80%] overflow-y-scroll px-8">
          {messages.map((msg) => (
            <div className={` flex items-center gap-y-4 gap-x-8 mb-8`}>
              <div
                className={`${
                  msg.sender === user?._id ? "ml-auto" : "mr-auto"
                } flex items-center gap-y-4 gap-x-8`}
              >
                {msg.sender !== user?._id && (
                  <p className="flex items-center gap-x-2 ">
                    <span>
                      <img
                        referrerPolicy="no-referrer"
                        className="w-[40px] h-[40px] rounded-full"
                        src={userData?.getUser?.picture}
                        alt=""
                      />
                    </span>
                    {/* <p className="flex flex-col gap-1">

                  <p className="text-[10px] bg-slate-700 text-white rounded-lg px-2 inline-block ">
                    {DateTime.fromMillis(parseInt(comment.time)).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                  </p>
                </p> */}
                  </p>
                )}
                <p className=" text-text bg-sky-400 dark:text-black dark:bg-sky-300 p-2 rounded">
                  {msg?.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="input-message flex items-center gap-4">
          <input
            className="w-full rounded-lg p-2 text-black"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMsg();
              }
            }}
            type="text"
          />
          <button
            onClick={sendMsg}
            className="bg-primary text-white rounded-lg  px-2 py-1"
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
