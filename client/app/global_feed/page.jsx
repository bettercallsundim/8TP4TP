"use client";

import { getDataFromLocal } from "@/utils/localStorage";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import LeftSidebar from "../components/LeftSidebar";
import PostCard from "../components/PostCard";
import MySheet from "../components/Sheet";
import { setUser } from "../redux/globalSlice";
const GET_ALL_POSTS = gql`
  query getAllPosts {
    getAllPosts {
      post
      approved
      authorPhoto
      comments {
        name
      }
      dislikes
      isPaid
      likes
      name
      photo
      time
      _id
    }
  }
`;
export default function Global_feed() {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);
  const posts = data?.getAllPosts;
  console.log(posts);
  const user = useSelector((state) => state.globalSlice.user);
  // const posts = useSelector((state) => state.globalSlice.posts);
  const dispatch = useDispatch();
  const router = useRouter();
  const commentRef = useRef();

  useEffect(() => {
    const user = getDataFromLocal("user");
    if (user?.id) {
      dispatch(setUser(user));
      router.push("/feed");
    }
  }, []);

  return (
    <div className="bg-bng text-text py-8 px-12 flex items-start h-[90vh] w-full overflow-hidden ">
      <MySheet commentRef={commentRef} />

      <div className="hidden md:block">
        <LeftSidebar />
      </div>
      <div className="hidescroll overflow-y-scroll h-[inherit]">
        <div>
          <CreatePost />
        </div>
        <div className=" ">
          {posts?.map((post, ind) => (
            <PostCard commentRef={commentRef} key={ind} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
