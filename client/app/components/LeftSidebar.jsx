import { HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { memo } from "react";
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
    link: "/profile",
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
const LeftSidebar = memo(({ nav }) => {
  return (
    <div className="bg-bng h-screen w-[300px] overflow-scroll mr-14 border-r-2 hidescroll">
      {links.map((link) => (
        <Link
          prefetch={false}
          href={link.link}
          className="flex items-center gap-x-4 p-4 hover:bg-secondary rounded-l-lg rounded-r-lg"
        >
          <span className="text-primary">{link.icon}</span>
          <h1 className="text-text">{link.name}</h1>
        </Link>
      ))}
    </div>
  );
});

export default LeftSidebar;
