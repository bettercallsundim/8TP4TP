import { gql, useMutation } from "@apollo/client";
import { DateTime } from "luxon";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import { FaCommentDots } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import EditMenu from "./EditMenu";
import MySheet from "./Sheet";
import Spinner from "./Spinner";
const GET_POST_BY_ID = gql`
  query getPostById($id: String!) {
    getPostById(id: $id) {
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
const LIKE_DISLIKE_POST = gql`
  mutation likeDislikePost($id: String!, $email: String!) {
    likeDislikePost(id: $id, email: $email) {
      liked
      post {
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
        tags {
          label
          value
        }
      }
    }
  }
`;

export default function PostCard({ post, refetch }) {
  // if (!post) return null;
  const dispatch = useDispatch();
  const [like, setLike] = useState(false);
  const [initPost, setInitPost] = useState({
    post: "",
    photo: "",
    name: "",
    time: "",
    likes: null,
    comments: null,
    dislikes: null,
    authorPhoto: "",
    author: "",
    approved: false,
    isPaid: null,
    _id: "",
    category: "",
    tags: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const token = useSelector((state) => state.globalSlice.token);
  console.log("token from postcaard", token);
  const user = useSelector((state) => state.globalSlice.user);
  const commentRef = useRef();
  const editMenuRef = useRef();
  const [sheetType, setSheetType] = useState();
  const [likeDislikePost, { error, loading: likeDislikeLoading }] = useMutation(
    LIKE_DISLIKE_POST,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    }
  );
  if (error) {
    console.log(error);
  }
  useEffect(() => {
    setInitPost({
      ...initPost,
      ...post,
    });
  }, [post]);

  return (
    <div
      onClick={() => {
        if (editMenuOpen) {
          setEditMenuOpen(false);
          setSheetType("edit");
        }
      }}
      className="max-w-[300px] min-h-[300px] rounded-lg px-6 py-8 bg-bng text-text mb-8 boxshadow flex flex-col relative "
    >
      {initPost.author === user?._id && (
        <button
          onClick={() => {
            setEditMenuOpen(!editMenuOpen);
          }}
          className=" text-2xl cursor-pointer text-accent hover:scale-105 duration-300 inline-block absolute right-4 top-6 z-[2]"
        >
          <CiMenuKebab />
        </button>
      )}
      <EditMenu
        refetch={refetch}
        postId={initPost._id}
        sheetType={sheetType}
        setSheetType={setSheetType}
        commentRef={commentRef}
        editMenuRef={editMenuRef}
        setEditMenuOpen={setEditMenuOpen}
        editMenuOpen={editMenuOpen}
      />
      <MySheet
        sheetType={sheetType}
        setSheetType={setSheetType}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        initPost={initPost}
        setInitPost={setInitPost}
        commentRef={commentRef}
        commentRequestPostID={initPost._id}
      />
      <div className="flex items-center header mb-4 pb-2 border-b-2 border-b-gray-300 ">
        <div className="pic mr-4">
          <img
            className="w-[40px] h-[40px] rounded-full"
            src={initPost.authorPhoto}
          />
        </div>
        <div>
          <p className="name font-semibold text-sm">
            <Link href={`profile/${initPost.author}`}>
              {" "}
              <span className="bg-primary text-bng rounded-lg px-2">
                {initPost.name}
              </span>
            </Link>
          </p>
          <p className="name text-text text-sm">
            {DateTime.fromMillis(parseInt(initPost.time)).toLocaleString(
              DateTime.DATETIME_MED
            )}
          </p>
        </div>
      </div>
      <div className="post mb-4 pb-2 ">
        <p>{initPost.post}</p>
      </div>
      {initPost.photo && (
        <div className=" h-[250px] w-[250px] rounded-sm mb-5 border-t-2 border-t-gray-300">
          <img
            className="w-full h-full rounded-sm object-cover"
            src={initPost.photo}
            alt=""
          />
        </div>
      )}
      <div className="flex items-center flex-wrap  gap-2 text-xs mt-auto">
        {initPost.tags?.map((tag, index) => {
          return (
            <span className="px-2 py-1 bgn-secondary rounded-xl">
              #{tag.value}
            </span>
          );
        })}{" "}
      </div>
      <div className="footer flex items-center justify-between  pb-2">
        <span className="flex items-center gap-2">
          {initPost?.likes?.includes(user?._id) ? (
            <AiFillLike
              onClick={() => {
                likeDislikePost({
                  variables: {
                    id: post._id,
                    email: user?.email,
                  },
                  update: (cache, data) => {
                    const likeDislikePost = data?.data?.likeDislikePost?.post;
                    if (likeDislikePost) {
                      setInitPost({
                        ...initPost,
                        ...likeDislikePost,
                      });
                    }
                  },
                });
                setLike(!like);
              }}
              className=" text-2xl cursor-pointer text-accent hover:scale-105 duration-300"
            />
          ) : (
            <AiOutlineLike
              onClick={() => {
                likeDislikePost({
                  variables: {
                    id: post._id,
                    email: user?.email,
                  },
                  update: (cache, data) => {
                    const likeDislikePost = data?.data?.likeDislikePost?.post;
                    if (likeDislikePost) {
                      setInitPost({
                        ...initPost,
                        ...likeDislikePost,
                      });
                    }
                  },
                });
                setLike(!like);
              }}
              className=" text-2xl cursor-pointer text-accent hover:scale-105 duration-300"
            />
          )}
          {likeDislikeLoading && <Spinner inline={true} />}
          <span className="flex items-center -mb-1">
            {initPost?.likes?.length}
          </span>
        </span>
        <span
          className="flex items-center gap-2"
          onClick={() => {
            console.log("hi from comment button");
            commentRef.current.click();
            setSheetType("comment");
          }}
        >
          <FaCommentDots className=" text-2xl cursor-pointer text-accent hover:scale-105 duration-300" />
          <span className="flex items-center -mb-1">
            {initPost?.comments?.length}
          </span>
        </span>
        <span>
          <FaCircleExclamation className=" text-2xl cursor-pointer text-accent hover:scale-105 duration-300" />
        </span>
      </div>
    </div>
  );
}
