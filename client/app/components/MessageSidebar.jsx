import { memo } from "react";
import { useSelector } from "react-redux";
import Conversations from "./Conversations";

const MessageSidebar = memo(({ nav }) => {
  const user = useSelector((state) => state.globalSlice.user);

  return (
    <div className="bg-bng h-screen w-[300px] overflow-scroll mr-14 border-r-2 border-slate-400 hidescroll">

      <Conversations />
    </div>
  );
});

export default MessageSidebar;
