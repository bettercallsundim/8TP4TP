"use client";
import { useSocket } from "@/app/components/SocketProvider";
import formatDate from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Conversations = () => {
  const { friendsConvo, friendsConvoList, selectedId, setSelectedId } =
    useSocket();
  console.log("🚀 ~ Conversations ~ friendsConvo:", friendsConvo);

  const router = useRouter();
  const user = useSelector((state) => state.globalSlice.user);

  return (
    <div className="mt-8">
      <h1 className="bg-accent py-2 px-2 font-semibold text-xl my-4">
        Conversations
      </h1>
      <div className="space-y-4 px-2 flex flex-col overflow-y-auto">
        {friendsConvoList.map((friend, ind) => {
          return (
            <div
              key={ind}
              onClick={() => {
                setSelectedId(friendsConvo[friend]._id);
                router.push(`/message/${friendsConvo[friend]._id}`);
              }}
              className="flex items-center cursor-pointer gap-x-2 border-b border-accent px-2 pb-4 hover:bg-gray-400"
            >
              <div className="image">
                <img
                  className={`w-[30px] h-[30px] rounded-full ${
                    friendsConvo[friend].isOnline &&
                    "outline outline-2 outline-offset-2 outline-green-500"
                  }`}
                  referrerPolicy="no-referrer"
                  src={friendsConvo[friend].picture}
                  alt="profile picture"
                />
              </div>
              <div className="convo-box">
                <p className="flex items-center gap-x-4">
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
                      <div className="w-[10px] aspect-square bg-green-500 rounded-full #ml-auto "></div>
                    )}
                </p>
                <p
                  className={`${
                    friendsConvo[friend].lastMessageSender !== user?._id &&
                    !friendsConvo[friend].isSeen &&
                    "font-bold"
                  }`}
                >
                  {friendsConvo[friend].lastMessage}
                </p>
                <p className="text-xs">
                  {formatDate(friendsConvo[friend].lastMessageTime)}
                  {/* {friendsConvo[friend].lastMessageTime} */}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Conversations;
