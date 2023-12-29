"use client";

import { getDataFromLocal } from "@/utils/localStorage";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import LeftSidebar from "../components/LeftSidebar";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import MySheet from "../components/Sheet";
import { setUser } from "../redux/globalSlice";
const GET_USER_POSTS = gql`
  query getPostByAuthor($email: String!) {
    getPostByAuthor(email: $email) {
      post
      approved
      authorPhoto
      dislikes
      comments {
        name
      }
      isPaid
      likes
      name
      photo
      time
      _id
    }
  }
`;
export default function feed() {
  const user = useSelector((state) => state.globalSlice.user);

  const { loading, error, data, refetch } = useQuery(GET_USER_POSTS, {
    onError: (err) => {
      console.log(err);
    },
    variables: {
      email: user?.email,
    },
  });
  const commentRef = useRef();
  const posts = data?.getPostByAuthor;
  console.log(posts, user?.email);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const user = getDataFromLocal("user");
    if (user?.id) {
      dispatch(setUser(user));
      router.push("/feed");
    }
  }, []);
  const array = [1, 2, 3];

  return (
    <div className="bg-bng text-text py-8 px-8 md:px-12 flex items-start md:h-[90vh] w-full overflow-hidden ">
      <MySheet commentRef={commentRef} />

      <div className="hidden md:block">
        <LeftSidebar />
      </div>
      <div className="hidescroll overflow-y-scroll h-[inherit] w-full md:w-[unset]">
        <div>
          <CreatePost loading={loading} refetch={refetch} />
        </div>
        <div className=" ">
          {loading && array?.map((_, ind) => <PostSkeleton key={ind} />)}
          {posts?.map((post, ind) => (
            <PostCard commentRef={commentRef} key={ind} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
