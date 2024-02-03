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
import PostSkeleton from "../components/PostSkeleton";
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
        author
        category
        tags {
          label
          value
        }
      }
    }
  }
`;
export default function Global_feed() {
  const user = useSelector((state) => state.globalSlice.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const commentRef = useRef();
  /// infinite scroll starts
  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const limit = 5;
  const [hasMore, setHasMore] = useState(limit);
  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: "0px 0px 50px 0px",
  });
  const [getAll, { loading, error, data, refetch }] = useLazyQuery(
    GET_ALL_POSTS,
    {
      variables: { limit, pageNumber },
    }
  );
  async function fetchMore() {
    refetch();
  }
  useEffect(() => {
    if (data?.getAllPosts?.posts?.length > 0) {
      setPosts((prev) => [...prev, ...data.getAllPosts.posts]);
      setHasMore(data.getAllPosts.hasMore);
    }
  }, [data?.getAllPosts?.posts?.length]);
  useEffect(() => {
    fetchMore();
  }, [pageNumber]);
  useEffect(() => {
    if (inView && Math.ceil(hasMore / limit) > pageNumber) {
      setPageNumber((prev) => prev + 1);
    } else if (inView && Math.ceil(hasMore / limit) == pageNumber) {
      // fetchMore();
    }
  }, [inView]);
  /// infinite scroll ends

  useEffect(() => {
    const user = getDataFromLocal("user");
    if (user?.id) {
      dispatch(setUser(user));
      router.push("/feed");
    }
  }, []);
  const array = [1, 2, 3];

  return (
    <div className="bg-bng text-text py-8 px-4 md:px-12 flex items-start h-[90vh] w-full overflow-hidden ">
      <MySheet commentRef={commentRef} />

      <div className="hidden md:block">
        <LeftSidebar />
      </div>
      <div className="hidescroll overflow-y-scroll h-[inherit] w-full md:w-[unset]">
        <div>
          <CreatePost />
        </div>

        <div className=" ">
          {posts?.map((post, ind) => {
            if (ind == posts.length - 1) {
              return <PostCard ref={ref} key={ind} post={post} />;
            } else {
              return <PostCard key={ind} post={post} />;
            }
          })}
          {loading && array?.map((_, ind) => <PostSkeleton key={ind} />)}
          <div ref={ref} className="lastOne h-[100px] w-full"></div>
        </div>
      </div>
    </div>
  );
}
