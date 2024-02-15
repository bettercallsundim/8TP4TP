"use client";
import { getDataFromLocal } from "@/utils/localStorage";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import LeftSidebar from "../components/LeftSidebar";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
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
      author
      isPaid
      likes
      name
      photo
      time
      _id
      tags {
        label
        value
      }
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

  const posts = data?.getPostByAuthor;
  console.log(posts, user?.email);
  const dispatch = useDispatch();
  const router = useRouter();

  const array = [1, 2, 3];
  useEffect(() => {
    setTimeout(() => {
      const token = getDataFromLocal("token");
      if (!user || !token) {
        router.push("/");
      }
    }, 500);
  }, [user]);

  return (
    <div className="bg-bng text-text py-8 px-4 md:px-12 flex items-start md:h-[90vh] w-full overflow-hidden ">
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
            <PostCard key={ind} post={post} refetch={refetch} />
          ))}
        </div>
      </div>
    </div>
  );
}
