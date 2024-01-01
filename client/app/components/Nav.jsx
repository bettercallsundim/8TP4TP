"use client";
import { removeDataFromLocal } from "@/utils/localStorage";
import { googleLogout } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import * as React from "react";
import toast from "react-hot-toast";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { HomeIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { logOut } from "../redux/globalSlice";
import UserContext from "./UserContext";
const mblLinks = [
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
function Nav() {
  const router = useRouter();
  const [showMenu, setShowMenu] = React.useState(false);
  const user = useSelector((state) => state.globalSlice.user);
  const handleLogout = () => {
    console.log("logging out");
    googleLogout();
    const notify = () => toast.success("Logged out successfully");
    notify();
    dispatch(logOut());
    removeDataFromLocal("token");
    removeDataFromLocal("user");
    router.push("/");
  };

  const dispatch = useDispatch();
  const [theme, setTheme] = React.useState("");
  function toggleTheme() {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }
  React.useEffect(() => {
    if (localStorage.getItem("theme")) {
      setTheme(localStorage.getItem("theme"));
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  }, []);
  React.useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("light");
    if (theme) document.documentElement.classList.add(theme);
    console.log(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Feed",
      path: "/feed",
    },
    {
      name: "Global Feed",
      path: "/global_feed",
    },
  ];
  return (
      <nav className="flex items-center justify-between py-4 md:py-0 px-8 glassmorph text-text">
      <div className="logo">food-O-graphy</div>
      <div className="links hidden md:block">
        <ul className="flex items-center gap-x-6">
          {links.map((link, ind) => (
            <li
              className="hover:bg-primary hover:text-bng duration-300 py-3 px-4 cursor-pointer"
              key={ind}
            >
              <Link href={link.path}>{link.name}</Link>
            </li>
          ))}
          {user?.email && (
            <li className="hover:bg-primary hover:text-bng duration-300 py-3 px-4 cursor-pointer">
              <button onClick={handleLogout} className="">
                Log Out
              </button>
            </li>
          )}
          <li className="hover:bg-primary hover:text-bng duration-300 py-2 px-4 cursor-pointer">
            <button onClick={toggleTheme} className="">
              {theme === "light" ? (
                <MdDarkMode className="text-3xl " />
              ) : (
                <MdLightMode className="text-3xl " />
              )}
            </button>
          </li>
        </ul>
      </div>
      <div className="menuButton md:hidden">
        <button
          className="md:hidden"
          onClick={() => {
            console.log("clicked");
            setShowMenu(!showMenu);
          }}
        >
          {showMenu ? (
            <IoMdClose className="text-3xl" />
          ) : (
            <CiMenuFries className="text-3xl" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            variants={{
              hide: {
                x: "-100%",
                transition: {
                  type: "spring",
                  bounce: 0.1,
                  when: "afterChildren",
                  staggerChildren: 0.001,
                },
              },
              show: {
                x: "0%",
                transition: {
                  type: "spring",
                  bounce: 0.1,
                  when: "beforeChildren",
                  staggerChildren: 0.001,
                },
              },
            }}
            initial="hide"
            animate="show"
            exit="hide"
            className="bg-bng h-screen fixed inset-0 top-20 z-[100] md:hidden"
          >
            {mblLinks.map((link) => (
              <motion.p
                variants={{
                  hide: {
                    y: "25%",
                    opacity: 0,
                  },
                  show: {
                    y: "0%",
                    opacity: 1,
                  },
                }}
              >
                <Link
                  prefetch={false}
                  href={link.link}
                  className="flex items-center gap-x-4 p-4 hover:bg-secondary rounded-l-lg rounded-r-lg"
                >
                  <span className="text-primary">{link.icon}</span>
                  <h1 className="text-text">{link.name}</h1>
                </Link>
              </motion.p>
            ))}
            {user?.email && (
              <motion.li
                variants={{
                  hide: {
                    y: "25%",
                    opacity: 0,
                  },
                  show: {
                    y: "0%",
                    opacity: 1,
                  },
                }}
                className="flex items-center gap-x-4 p-4 hover:bg-secondary rounded-l-lg rounded-r-lg"
                onClick={handleLogout}
              >
                <button className="">Log Out</button>
              </motion.li>
            )}
            <motion.li
              variants={{
                hide: {
                  y: "25%",
                  opacity: 0,
                },
                show: {
                  y: "0%",
                  opacity: 1,
                },
              }}
              className="flex items-center gap-x-4 p-4 hover:bg-secondary rounded-l-lg rounded-r-lg"
              onClick={toggleTheme}
            >
              <button className="flex items-center">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
                {theme === "light" ? (
                  <MdDarkMode className="text-3xl my-auto" />
                ) : (
                  <MdLightMode className="text-3xl my-auto" />
                )}
              </button>
            </motion.li>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Nav;
