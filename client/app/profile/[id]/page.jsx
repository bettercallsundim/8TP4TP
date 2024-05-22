"use client";
import LeftSidebar from "@/app/components/LeftSidebar";
import PostCard from "@/app/components/PostCard";
import PostSkeleton from "@/app/components/PostSkeleton";
import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRef } from "react";

import { useSelector } from "react-redux";
const GET_USER_POSTS = gql`
  query getPostByAuthorId($_id: String!) {
    getPostByAuthorId(_id: $_id) {
      name
      email
      picture
      follows {
        name
        _id
      }
      followed_by {
        name
        _id
      }
      posts {
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
  }
`;
const FOLLOW_UNFOLLOW = gql`
  mutation followUnfollow($by: String!, $to: String!) {
    followUnfollow(by: $by, to: $to) {
      follow
    }
  }
`;
export default function Profile({ params }) {
  const divRef = useRef(null);
  const [top, setTop] = useState(0);

  const user = useSelector((state) => state.globalSlice.user);
  const token = useSelector((state) => state.globalSlice.token);
  const [followed, setFollowed] = useState(false);
  useEffect(() => {
    const positionFromTop = divRef?.current?.offsetTop;
    setTop(positionFromTop);
  }, []);
  const { loading, error, data, refetch } = useQuery(GET_USER_POSTS, {
    onError: (err) => {
      console.log(err);
    },
    variables: {
      _id: params.id,
    },
  });

  const [
    followUnfollow,
    { error: followUnfollowError, loading: followUnfollowLoading },
  ] = useMutation(FOLLOW_UNFOLLOW, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  if (followUnfollowError) {
    console.log(followUnfollowError);
  }
  const userGot = data?.getPostByAuthorId;
  useEffect(() => {
    const isFollowing = userGot?.followed_by?.find((f) => f._id === user?._id);
    if (isFollowing) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [userGot, user]);
  const array = [1, 2, 3];

  return (
    <div ref={divRef} className="bg-bng text-text py-8 px-4 md:px-12 flex items-start md:h-[90vh] w-full overflow-hidden ">
      <div className="hidden md:block">
        <LeftSidebar />
      </div>
      <div className="hidescroll overflow-y-scroll h-[inherit] w-full ">
        <div className="my-12 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <img
              src={userGot?.picture}
              alt="profile"
              className="rounded-full h-20 w-20"
            />
            <span className="font-semibold text-center">{userGot?.name}</span>
          </div>
          <div className="space-y-2 ">
            <span className="text-sm font-medium mb-4 ml-auto">
              Follows : {userGot?.follows?.length}
            </span>
            <br />
            <span className="text-sm font-medium ml-auto">
              Follower : {userGot?.followed_by?.length}
            </span>
            <br />
            <div className="flex items-center gap-x-2">
              {params.id != user?._id && (
                <button
                  className="bg-text text-bng hover:bg-primary text-sm rounded-xl py-1 px-2"
                  onClick={() => {
                    followUnfollow({
                      variables: {
                        by: user._id,
                        to: params.id,
                      },
                      update: (cache, data) => {
                        const flwUnflw = data.data.followUnfollow.follow;
                        if (flwUnflw) {
                          setFollowed(true);
                        } else {
                          setFollowed(false);
                        }
                      },
                    });
                  }}
                >
                  {followed ? "Unfollow" : "Follow"}
                </button>
              )}
              <Link
                href={`/message/${params.id}`}
                className="bg-text text-bng hover:bg-primary text-sm rounded-xl py-1 px-2"
              >
                Message
              </Link>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div>
          <h1 className="text-2xl font-bold text-text mb-4">Posts</h1>
        </div>
        <div className=" ">
          {loading && array?.map((_, ind) => <PostSkeleton key={ind} />)}
          {userGot?.posts?.map((post, ind) => (
            <PostCard key={ind} post={post} refetch={refetch} />
          ))}
        </div>
      </div>
    </div>
  );
}
