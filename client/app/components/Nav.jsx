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

import Link from "next/link";
import { logOut } from "../redux/globalSlice";
import MobileNav from "./MobileNav";

function Nav(props) {
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
              className="hover:bg-cyan-400 duration-300 py-3 px-4 cursor-pointer"
              key={ind}
            >
              <Link href={link.path}>{link.name}</Link>
            </li>
          ))}
          {user?.email && (
            <li className="hover:bg-cyan-400 duration-300 py-3 px-4 cursor-pointer">
              <button onClick={handleLogout} className="">
                Log Out
              </button>
            </li>
          )}
          <li className="hover:bg-cyan-400 duration-300 py-3 px-4 cursor-pointer">
            <button onClick={toggleTheme} className="">
              {theme === "light" ? (
                <MdDarkMode className="text-3xl my-auto" />
              ) : (
                <MdLightMode className="text-3xl my-auto" />
              )}
            </button>
          </li>
        </ul>
      </div>
      <div className="menuButton">
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

      <MobileNav nav={showMenu} />
    </nav>
  );
}

export default Nav;
