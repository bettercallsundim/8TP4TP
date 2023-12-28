import { gql, useMutation } from "@apollo/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCommentDots } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setCommentRequestPostID } from "../redux/globalSlice";
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
      }
    }
  }
`;
// const Sheet = () => (

// );
export default function PostCard({ post, commentRef }) {
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
    approved: false,
    isPaid: null,
    _id: "",
  });
  // const [getPost, { data: getPostData }] = useLazyQuery(GET_POST_BY_ID);
  // const commentRequestPostID = useSelector(
  //   (state) => state.globalSlice.commentRequestPostID
  // );
  // useEffect(() => {
  //   if (commentRequestPostID == initPost._id) {
  //     getPost({
  //       variables: { id: commentRequestPostID },
  //     });
  //     if (getPostData) {
  //       console.log("getPostData", getPostData);
  //     }
  //   }
  // }, [commentRequestPostID]);

  const token = useSelector((state) => state.globalSlice.token);
  const user = useSelector((state) => state.globalSlice.user);
  const [likeDislikePost] = useMutation(LIKE_DISLIKE_POST, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });

  useEffect(() => {
    setInitPost({
      ...initPost,
      ...post,
    });
  }, [post]);

  return (
    <div className="w-[300px] min-h-[300px] rounded-lg px-4 py-8 bg-bng text-text mb-8 boxshadow flex flex-col">
      <div className="flex items-center header mb-4 pb-2 border-b-2 border-b-gray-300">
        <div className="pic mr-4">
          <img
            className="w-[40px] h-[40px] rounded-full"
            src={initPost.authorPhoto}
          />
        </div>
        <div>
          <p className="name font-semibold">
            <span className="bg-primary text-bng rounded-lg px-2">
              {initPost.name}
            </span>
          </p>
          <p className="name text-text">
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
      <div className="footer flex items-center justify-between mt-auto">
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
          <span className="flex items-center -mb-1">
            {initPost?.likes?.length}
          </span>
        </span>
        <span
          className="flex items-center gap-2"
          onClick={() => {
            console.log("hi from comment button");
            commentRef.current.click();
            dispatch(setCommentRequestPostID({ id: post._id }));
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
