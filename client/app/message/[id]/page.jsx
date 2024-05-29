"use client";
import LeftSidebar from "@/app/components/LeftSidebar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import MessageSidebar from "@/app/components/MessageSidebar";
import { useSocket } from "@/app/components/SocketProvider";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";

const Message = ({ params: { id } }) => {
  console.log("🚀 ~ Message ~ id:", id);
  const user = useSelector((state) => state.globalSlice.user);
  const token = useSelector((state) => state.globalSlice.token);
  const friendsConvo = useSelector((state) => state.globalSlice.friendsConvo);
  const [message, setMessage] = useState("");
  const [top, setTop] = useState(0);
  const msgRef = useRef(null);
  const divRef = useRef(null);
  const {
    socket,
    conversationId,
    userData,
    setSelectedId,
    getConversationData,
    selectedId,
    messages,
    setMessages,
    sendMsg,
  } = useSocket();

  useEffect(() => {
    if (id) setSelectedId(id);
  }, [id]);
  useEffect(() => {
    const positionFromTop = divRef?.current?.offsetTop;
    setTop(positionFromTop);
  }, []);

  useEffect(() => {
    msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={divRef}
      style={{
        height: `calc(100vh - ${top}px)`,
      }}
      className="bg-bng text-text py-4 px-4 md:px-12 flex items-start   w-full overflow-hidden "
    >
      <div className="hidden md:block">
        <MessageSidebar />
      </div>
      <div className="hidescroll #overflow-y-scroll #h-[calc(100vh-100px)] h-full md:h-full w-full ">
        {/* ////user details */}
        <div className="user-details h-[80px] boxshadow rounded-lg px-8 py-4">
          <div className="flex items-center gap-4">
            <img
              src={userData?.getUser?.picture}
              alt=""
              className={`w-12 h-12 rounded-full ${
                id &&
                Object.keys(friendsConvo || {}).length > 0 &&
                friendsConvo[id]?.isOnline
                  ? "outline outline-2 outline-offset-2 outline-green-600"
                  : "outline outline-2 outline-offset-2 outline-gray-500"
              }`}
            />
            <span className="flex flex-col">
              <span className="text-xl">{userData?.getUser?.name}</span>
              {id &&
              Object.keys(friendsConvo || {}).length > 0 &&
              friendsConvo[id]?.isOnline ? (
                <span className="text-xs text-green-600 font-medium">
                  Online
                </span>
              ) : (
                <span className="text-xs text-gray-500 font-medium">
                  Offline
                </span>
              )}
            </span>
          </div>
        </div>
        <div
          ref={msgRef}
          style={{
            height: `calc(100vh - ${top + 180}px)`,
          }}
          className="messages  overflow-y-scroll px-2 md:px-8 pt-2"
        >
          {messages.map((msg, ind) => (
            <div
              key={ind}
              className={` flex   items-center gap-y-4 gap-x-8 mb-8`}
            >
              <div
                className={`${
                  msg.sender === user?._id ? "ml-auto" : "mr-auto"
                } flex flex-wrap items-center gap-y-4 gap-x-8`}
              >
                {msg.sender !== user?._id && (
                  <p className="flex  items-center gap-x-2 ">
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
        <div className="input-message h-[80px]  pt-4 pb-8 md:pb-4 flex items-center gap-4">
          <input
            className="w-full rounded-lg p-2 text-black border border-gray-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMsg(message);
                setMessage("");
              }
            }}
            type="text"
          />
          <button
            onClick={() => {
              sendMsg(message);
              setMessage("");
            }}
            className="bg-primary text-white rounded-lg  px-2 py-2 mr-4"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
