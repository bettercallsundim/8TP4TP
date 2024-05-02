import { HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { memo } from "react";
import { useSelector } from "react-redux";
import Conversations from "./Conversations";

const LeftSidebar = memo(({ nav }) => {
  const user = useSelector((state) => state.globalSlice.user);
  const links = [
    {
      name: "Home",
      link: "/",
      icon: <HomeIcon />,
      description: "",
    },
    {
      name: "Feed",
      link: "/feed",
      icon: <HomeIcon />,
      description: "",
    },
    {
      name: "My Profile",
      link: user?._id ? `/profile/${user?._id}` : "/profile",
      icon: <HomeIcon />,
      description: "",
    },
    {
      name: "Global Feed",
      link: "/global_feed",
      icon: <HomeIcon />,
      description: "",
    },
  ];
  return (
    <div className="bg-bng h-screen w-[300px] overflow-scroll mr-14 border-r-2 border-slate-400 hidescroll">
      {links.map((link) => (
        <Link
          prefetch={false}
          href={link.link}
          className="flex items-center gap-x-4 px-4 py-3 hover:bg-pink-400   rounded-l-lg rounded-r-lg"
        >
          <span className="text-primary">{link.icon}</span>
          <h1 className="text-text ">{link.name}</h1>
        </Link>
      ))}
      <Conversations/>
    </div>
  );
});

export default LeftSidebar;
