"use client";
import { Avatar } from "@mui/material";
import { memo } from "react";
import { useSelector } from "react-redux";
import LeftSidebar from "../components/LeftSidebar";

const Profile = memo(() => {
  const user = useSelector((state) => state.globalSlice.user);
  return (
    <div className="bg-bng text-text py-8 px-12 flex items-start h-[90vh] w-full overflow-hidden ">
      <LeftSidebar />
      <div className="hidescroll overflow-y-scroll h-[inherit]">
        <div>
          <p>
            <Avatar alt="Remy Sharp" src={user?.picture} />
          </p>
        </div>
      </div>
    </div>
  );
});

export default Profile;
