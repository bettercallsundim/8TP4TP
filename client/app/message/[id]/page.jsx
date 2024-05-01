"use client";
import LeftSidebar from "@/app/components/LeftSidebar";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { gql, useMutation, useQuery } from "@apollo/client";
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
  console.log(data, "graphql message");

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
              update: (cache, data) => {
                console.log(data, "from send message data");
              },
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
        update: (cache, data) => {
          console.log(data, "from send message data");
        },
      });
    }
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
  console.log(getMessagesData, "from get messages data");

  useEffect(() => {
    if (conversationId) {
      getMessagesRefetch();
    }
  }, [conversationId]);
  useEffect(() => {
    if (getMessagesData?.getMessages) setMessages(getMessagesData?.getMessages);
  }, [getMessagesData]);
  return (
    <div className="bg-bng text-text py-8 px-4 md:px-12 flex items-start md:h-[90vh] w-full overflow-hidden ">
      <div className="hidden md:block">
        <LeftSidebar />
      </div>
      <div className="hidescroll overflow-y-scroll h-[inherit] w-full ">
        {messages.map((msg) => (
          <p
            className={`${
              msg.sender === user?._id ? "text-right" : "text-left"
            }`}
          >
            {msg.text}
          </p>
        ))}
        <div>
          <input
            className=""
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
          />
          <button onClick={sendMsg} className="bg-sky-500 text-black px-2 py-1">
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
