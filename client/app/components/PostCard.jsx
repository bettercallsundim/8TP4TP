import { gql, useMutation } from "@apollo/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCommentDots } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import { useSelector } from "react-redux";
// const GET_POST_BY_ID = gql`
//   query getPostById($id: String!) {
//     getPostById(id: $id) {
//       post
//       approved
//       authorPhoto
//       comments
//       dislikes
//       isPaid
//       likes
//       name
//       photo
//       time
//       _id
//     }
//   }
// `;
const LIKE_DISLIKE_POST = gql`
  mutation likeDislikePost($id: String!, $email: String!) {
    likeDislikePost(id: $id, email: $email) {
      liked
      post {
        post
        approved
        authorPhoto
        comments
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
export default function PostCard({ post }) {
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
  // const { loading, error, data, refetch } = useQuery(GET_POST_BY_ID, {
  //   variables: {
  //     id: post._id,
  //   },
  // });
  // const fetched_post = data?.getPostById;
  const token = useSelector((state) => state.globalSlice.token);
  const user = useSelector((state) => state.globalSlice.user);

  const [likeDislikePost] = useMutation(LIKE_DISLIKE_POST, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  // const fetched_post = data?.likeDislikePost?.post;
  // console.log("fetched_post", data);
  useEffect(() => {
    setInitPost({
      ...initPost,
      ...post,
    });
  }, [post]);
  useEffect(() => {
    console.log("initPost", initPost);
  }, [initPost]);

  return (
    <div className="w-[300px] min-h-[300px] rounded-lg px-4 py-8 bg-bng text-text mb-8 boxshadow">
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
      <div className="post mb-4 pb-2 border-b-2 border-b-gray-300">
        <p>{initPost.post}</p>
      </div>
      <div className=" h-[250px] w-[250px] rounded-sm mb-5">
        <img
          className="w-full h-full rounded-sm object-cover"
          src={initPost.photo}
          alt=""
        />
      </div>
      <div className="footer flex items-center justify-between">
        <span>
          {initPost?.likes?.includes(user?._id) ? (
            <AiFillLike
              onClick={() => {
                console.log({
                  id: post._id,
                  email: user?.email,
                  token,
                });
                likeDislikePost({
                  variables: {
                    id: post._id,
                    email: user?.email,
                  },
                  update: (cache, data) => {
                    console.log(data);
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
                console.log({
                  id: post._id,
                  email: user?.email,
                  token,
                });
                likeDislikePost({
                  variables: {
                    id: post._id,
                    email: user?.email,
                  },
                  update: (cache, data) => {
                    console.log(data);

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
        </span>
        <span>
          <FaCommentDots className=" text-2xl cursor-pointer text-accent hover:scale-105 duration-300" />
        </span>
        <span>
          <FaCircleExclamation className=" text-2xl cursor-pointer text-accent hover:scale-105 duration-300" />
        </span>
      </div>
    </div>
  );
}
