"use client";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setFriendsConvoRedux } from "../redux/globalSlice";
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
const GET_CONVERSATION = gql`
  query getConversation($_id1: String!, $_id2: String!) {
    getConversation(_id1: $_id1, _id2: $_id2) {
      _id
      members
    }
  }
`;
const GET_USER = gql`
  query getUser($_id: String!) {
    getUser(_id: $_id) {
      name
      picture
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
const SocketContext = createContext();
export const useSocket = () => {
  return useContext(SocketContext);
};
const SocketProvider = ({ children }) => {
  const user = useSelector((state) => state.globalSlice.user);
  const token = useSelector((state) => state.globalSlice.token);
  const dispatch = useDispatch();
  const [friendsConvo, setFriendsConvo] = useState({});
  const [friendsConvoList, setFriendsConvoList] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [updateNeed, setUpdateNeed] = useState(null);
  const [updateNeedSent, setUpdateNeedSent] = useState(null);
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET);
    if (!socket) setSocket(newSocket);
    newSocket?.on("connect", () => {
      console.log("from socket: hello world");
    });

    newSocket?.on("receive-message", (msg) => {
      if (msg.sender == selectedId) {
        setMessages((prev) => [
          ...prev,
          { text: msg.text, sender: msg.sender },
        ]);
      }
      setUpdateNeed(msg);
    });

    // Clean up function to close socket connection when component unmounts
    return () => newSocket.close();
  }, []);
  useEffect(() => {
    socket?.emit("join", user?._id);
    socket?.on("online-users", (onlineUser) => {
      setOnlineUsers(onlineUser);
    });
    return () => {
      socket?.off("join");
      socket?.off("online-users");
    };
  }, [socket, user]);

  /// fetching conversation of the user
  const [refetch, { loading, error, data }] = useLazyQuery(GET_CONVERSATIONS, {
    onError: (err) => {
      console.log(err);
    },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (user) {
      refetch({
        variables: {
          _id: user?._id,
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (data?.getConversations) {
      let friends = { ...friendsConvo };

      data?.getConversations.forEach((convo) => {
        if (convo.user1._id === user._id) {
          friends[convo.user2._id] = {
            ...convo.user2,
            lastMessage: convo.lastMessage,
            lastMessageTime: convo.lastMessageTime,
            lastMessageSender: convo.lastMessageSender,
            isSeen: convo.isSeen,
            isOnline:
              Object.keys(onlineUsers).length > 0 &&
              onlineUsers[convo.user2._id] !== "undefined" &&
              onlineUsers[convo.user2._id],
          };
        } else {
          friends[convo.user1._id] = {
            ...convo.user1,
            lastMessage: convo.lastMessage,
            lastMessageTime: convo.lastMessageTime,
            lastMessageSender: convo.lastMessageSender,
            isSeen: convo.isSeen,
            isOnline:
              Object.keys(onlineUsers).length > 0 &&
              onlineUsers[convo.user1._id] !== "undefined" &&
              onlineUsers[convo.user1._id],
          };
        }
      });
      setFriendsConvo(friends);
    }
  }, [data, onlineUsers]);
  useEffect(() => {
    setFriendsConvoList(Object.keys(friendsConvo));
    dispatch(setFriendsConvoRedux({ friendsConvo: { ...friendsConvo } }));
  }, [friendsConvo]);

  //get convo after selecting id

  const [
    getConversation,
    {
      loading: getConversationLoading,
      error: getConversationError,
      data: getConversationData,
    },
  ] = useLazyQuery(GET_CONVERSATION, {
    onError: (err) => {
      console.log(err);
    },
    variables: {
      _id1: selectedId,
      _id2: user?._id,
    },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  const [
    userRefetch,
    { loading: userLoading, error: userError, data: userData },
  ] = useLazyQuery(GET_USER, {
    onError: (err) => {
      console.log(err);
    },
    variables: {
      _id: selectedId,
    },
  });
  useEffect(() => {
    if (user?._id && selectedId) {
      getConversation();
      userRefetch();
    }
  }, [user, selectedId]);
  useEffect(() => {
    if (getConversationData?.getConversation?._id) {
      setConversationId(getConversationData?.getConversation?._id);
    }
  }, [getConversationData]);

  /// get messages
  const [
    getMessagesRefetch,
    {
      loading: getMessagesLoading,
      error: getMessagesError,
      data: getMessagesData,
    },
  ] = useLazyQuery(GET_MESSAGES, {
    onError: (err) => {
      console.log(err);
    },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    if (conversationId) {
      getMessagesRefetch({
        variables: {
          conversationId,
        },
      });
    }
  }, [conversationId]);

  useEffect(() => {
    if (getMessagesData?.getMessages) setMessages(getMessagesData?.getMessages);
  }, [getMessagesData]);

  ///send messages
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

  async function sendMsg(message) {
    if (getConversationData?.getConversation === null) {
      createConversation({
        variables: {
          members: [selectedId, user?._id],
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
    socket?.emit("send-message", { message, to: selectedId, from: user?._id });
    setUpdateNeedSent({ text: message, sender: user?._id });
    setMessages((prev) => [...prev, { text: message, sender: user?._id }]);
  }

  useEffect(() => {
    if (updateNeed) {
      friendsConvoList.forEach((friendId) => {
        if (friendId === updateNeed?.sender) {
          setFriendsConvo((prev) => ({
            ...friendsConvo,
            [friendId]: {
              ...prev[friendId],
              lastMessage: updateNeed.text,
              lastMessageSender: friendId,
              lastMessageTime: updateNeed.lastMessageTime,
            },
          }));
        }
      });
      setUpdateNeed(null);
    }
  }, [updateNeed]);
  useEffect(() => {
    if (updateNeedSent) {
      friendsConvoList.forEach((friendId) => {
        if (friendId === selectedId) {
          setFriendsConvo((prev) => ({
            ...friendsConvo,
            [friendId]: {
              ...prev[friendId],
              lastMessage: updateNeedSent.text,
              lastMessageSender: user?._id,
              lastMessageTime: Date.now(),
            },
          }));
        }
      });
      setUpdateNeedSent(null);
    }
  }, [updateNeedSent]);
  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        setOnlineUsers,
        friendsConvo,
        friendsConvoList,
        selectedId,
        setSelectedId,
        conversationId,
        userData,
        getConversationData,
        messages,
        setMessages,
        sendMsg,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
