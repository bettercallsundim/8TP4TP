"use client";

import { getDataFromLocal } from "@/utils/localStorage";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import LeftSidebar from "../components/LeftSidebar";
import InstagramPost from "../components/PostCard";
import { setUser } from "../redux/globalSlice";
const GET_GREETING = gql`
  query greetings {
    hello
  }
`;
export default function feed() {
  const { loading, error, data } = useQuery(GET_GREETING);
  console.log(data);
  const user = useSelector((state) => state.globalSlice.user);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const user = getDataFromLocal("user");
    if (user?.id) {
      dispatch(setUser(user));
      router.push("/feed");
    }
  }, []);

  return (
    <div className="bg-bng text-text py-8 px-12 flex items-start h-[90vh] w-full overflow-hidden ">
      <LeftSidebar />
      <div className="hidescroll overflow-y-scroll h-[inherit]">
        <div>
          <CreatePost />
        </div>
        <div className=" ">
          <InstagramPost />
          <InstagramPost />
          <InstagramPost />
          <InstagramPost />
          <InstagramPost />
          <InstagramPost />
          <InstagramPost />
        </div>
      </div>
    </div>
  );
}
