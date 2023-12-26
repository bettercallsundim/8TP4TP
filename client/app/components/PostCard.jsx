import { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCommentDots } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";

export default function PostCard({ post: { post, photo, author, time } }) {
  const [like, setLike] = useState(false);
  return (
    <div className="w-[300px] min-h-[300px] rounded-lg px-4 py-8 bg-bng text-text mb-8 boxshadow">
      <div className="header mb-4 pb-2 border-b-2 border-b-gray-300">
        <p className="name font-semibold">
          <span className="bg-primary text-bng rounded-lg px-2">{author}</span>
        </p>
        <p className="name text-text">{time}</p>
      </div>
      <div className="post">
        <p>{post}</p>
      </div>
      <div className=" h-[250px] w-[250px] rounded-sm mb-5">
        <img
          className="w-full h-full rounded-sm object-cover"
          src={photo}
          alt=""
        />
      </div>
      <div className="footer flex items-center justify-between">
        <span>
          {like ? (
            <AiFillLike
              onClick={() => setLike(!like)}
              className=" text-2xl cursor-pointer text-accent hover:scale-105 duration-300"
            />
          ) : (
            <AiOutlineLike
              onClick={() => setLike(!like)}
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
