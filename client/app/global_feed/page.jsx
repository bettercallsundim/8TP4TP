"use client";

import { getDataFromLocal } from "@/utils/localStorage";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import LeftSidebar from "../components/LeftSidebar";
import PostCard from "../components/PostCard";
import MySheet from "../components/Sheet";
import { setUser } from "../redux/globalSlice";
const GET_ALL_POSTS = gql`
  query getAllPosts($limit: Int!, $pageNumber: Int!) {
    getAllPosts(limit: $limit, pageNumber: $pageNumber) {
      hasMore
      posts {
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
  }
`;
export default function Global_feed() {
  const [pageNumber, setPageNumber] = useState(1);
  const limit = 5;
  const [getAll, { loading, error, data }] = useLazyQuery(GET_ALL_POSTS);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const user = useSelector((state) => state.globalSlice.user);
  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: "0px 0px 50px 0px",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const commentRef = useRef();

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function fetchMore() {
    console.log("fetching more");
    // await delay(2000);
    getAll({
      variables: { limit, pageNumber },
    });
  }

  useEffect(() => {
    if (data?.getAllPosts?.posts?.length > 0) {
      console.log("data.getAllPosts", data.getAllPosts);
      setPosts((prev) => [...prev, ...data.getAllPosts.posts]);
      setHasMore(data.getAllPosts.hasMore);
    }
  }, [data]);
  useEffect(() => {
    if (hasMore) {
      fetchMore();
    }
  }, [pageNumber]);
  useEffect(() => {
    if (inView) {
      setPageNumber((prev) => prev + 1);
    }
    console.log("inView", hasMore);
  }, [inView]);
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
          {posts?.map((post, ind) => {
            if (ind == posts.length - 1) {
              return (
                <PostCard
                  ref={ref}
                  commentRef={commentRef}
                  key={ind}
                  post={post}
                />
              );
            } else {
              return <PostCard commentRef={commentRef} key={ind} post={post} />;
            }
          })}
          <div ref={ref} className="lastOne h-[100px] w-full"></div>
        </div>
      </div>
    </div>
  );
}
