import { HomeIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
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
const MobileNav = memo(({ nav }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 1,
        }}
        className={
          nav
            ? "bg-bng h-[100vh] md:h-screen w-[250px] md:w-[300px] overflow-scroll md:mr-14 border-r-2 hidescroll fixed top-0 bottom-0 left-0 z-[99999999999999] md:relative md:top-[unset] md:bottom-[unset] md:left-[unset] md:hidden"
            : "hidden md:hidden"
        }
      >
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
      </motion.div>
    </AnimatePresence>
  );
});

export default MobileNav;
