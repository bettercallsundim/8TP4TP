"use client";
import LeftSidebar from "@/app/components/LeftSidebar";
import PostCard from "@/app/components/PostCard";
import PostSkeleton from "@/app/components/PostSkeleton";
import { gql, useQuery } from "@apollo/client";
const GET_USER_POSTS = gql`
  query getPostByAuthorId($_id: String!) {
    getPostByAuthorId(_id: $_id) {
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
export default function Profile({ params }) {
  const { loading, error, data, refetch } = useQuery(GET_USER_POSTS, {
    onError: (err) => {
      console.log(err);
    },
    variables: {
      _id: params.id,
    },
  });
  const posts = data?.getPostByAuthorId;
  const array = [1, 2, 3];

  return (
    <div className="bg-bng text-text py-8 px-4 md:px-12 flex items-start md:h-[90vh] w-full overflow-hidden ">
      <div className="hidden md:block">
        <LeftSidebar />
      </div>
      <div className="hidescroll overflow-y-scroll h-[inherit] w-full ">
        <div>
          <h1 className="text-2xl font-bold text-text">Posts</h1>
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
