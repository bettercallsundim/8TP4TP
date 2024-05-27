"use client";
import { gql, useLazyQuery } from "@apollo/client";
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
const SocketContext = createContext();
export const useSocket = () => {
  return useContext(SocketContext);
};
const SocketProvider = ({ children }) => {
  const user = useSelector((state) => state.globalSlice.user);
  const token = useSelector((state) => state.globalSlice.token);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET);
    newSocket?.on("connect", () => {
      console.log("from socket: hello world");
    });
    setSocket(newSocket);

    // Clean up function to close socket connection when component unmounts
    return () => newSocket.close();
  }, []);
  useEffect(() => {
    socket?.emit("join", user?._id);
    socket?.on("online-users", (onlineUser) => {
      setOnlineUsers(onlineUser);
    });
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
  const [friendsConvo, setFriendsConvo] = useState({});
  const [friendsConvoList, setFriendsConvoList] = useState([]);
  const dispatch = useDispatch();

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
            isOnline: convo.user2._id in onlineUsers,
          };
        } else {
          friends[convo.user1._id] = {
            ...convo.user1,
            lastMessage: convo.lastMessage,
            lastMessageTime: convo.lastMessageTime,
            lastMessageSender: convo.lastMessageSender,
            isSeen: convo.isSeen,
            isOnline: convo.user1._id in onlineUsers,
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
  const [conversationId, setConversationId] = useState(null);

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
        getConversationData
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
