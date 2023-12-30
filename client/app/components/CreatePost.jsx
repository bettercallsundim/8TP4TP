"use client";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { getDataFromLocal } from "@/utils/localStorage";
import { gql, useMutation } from "@apollo/client";
import axios from "axios";
import { memo, useEffect, useRef, useState } from "react";
import { BiSolidImageAdd } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./Spinner";
const CreatePost = memo(({ refetch, loading }) => {
  const [doc, setDoc] = useState({ post: "", photo: "" });
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  // const [user, setUser] = useState(null);
  const user=useSelector(state=>state.globalSlice.user)
  const [token, setToken] = useState(null);

  const addPost = gql`
    mutation addPost($post: String!, $photo: String, $email: String!) {
      addPost(post: $post, photo: $photo, email: $email) {
        post
        photo
        time
        name
        authorPhoto
      }
    }
  `;
  const [postStatus] = useMutation(addPost, {
    onError: (err) => {
      console.log(err);
      setLoading(false);
    },
    context: {
      headers: {
        authorization: "Bearer " + token,
      },
    },
  });
  async function uploadPost(e) {
    e.preventDefault();

    console.log(doc, "doc");
    // if user uploads a photo
    if (fileRef.current.files.length > 0 && doc.photo) {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", doc.photo);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_CLOUDINARY}${
            doc?.photo?.type?.includes("image") ? "image" : "video"
          }/upload`,
          formData
        )
        .then(async (res) => {
          postStatus({
            variables: {
              post: doc.post,
              photo: res.data.secure_url,
              email: user.email,
            },

            update: (
              cache,
              {
                data: {
                  addPost: { post, name, time, photo, authorPhoto },
                },
              }
            ) => {
              refetch();
              setLoading(false);
            },
          });
          setDoc({ post: "", photo: "" });
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error uploading file", error);
        });
      fileRef.current.value = "";
    } else {
      if (!doc.post) {
        return;
      }
      setLoading(true);

      postStatus({
        variables: {
          post: doc.post,
          email: user.email,
        },

        update: (
          cache,
          {
            data: {
              addPost: { post, name, time, authorPhoto },
            },
          }
        ) => {
          refetch();
          setLoading(false);
        },
      });

      setDoc({ post: "", photo: "" });
    }
  }
  useEffect(() => {
    // const gotUser = getDataFromLocal("user");
    const { token: gotToken } = getDataFromLocal("token");
    // if (gotUser) setUser(gotUser);
    if (gotToken) setToken(gotToken);
  }, []);

  return (
    <div>
      <Toaster />
      <form
        className="w-[300px] md:w-[400px]"
        onSubmit={uploadPost}
        encType="multipart/form-data"
      >
        <textarea
          className=" border-2 border-gray-300 p-3 w-full rounded-lg outline-none bg-bng text-text"
          rows="3"
          placeholder="Write a post ..."
          onChange={(e) => setDoc({ ...doc, [e.target.name]: e.target.value })}
          value={doc.post}
          name="post"
          type="text"
        ></textarea>
        <br />
        <div className="flex items-center gap-x-8">
          {photoURL && (
            <div>
              <img
                className="w-10  h-10 border-gray-300 border-2 rounded"
                src={photoURL}
                alt=""
              />
            </div>
          )}
          <label htmlFor="photo">
            <button
              onClick={(e) => {
                e.preventDefault();
                fileRef.current.click();
              }}
            >
              <BiSolidImageAdd className="text-3xl hover:text-primary" />
            </button>
            <input
              ref={fileRef}
              onChange={(e) => {
                console.log(e.target.files[0]);

                if (e.target.files[0].type.includes("image")) {
                  setDoc({ ...doc, photo: e.target.files[0] });
                  setPhoto(e.target.files[0]);
                  setPhotoURL(URL.createObjectURL(e.target.files[0]));
                } else if (e.target.files[0].type.includes("video")) {
                  setDoc({ ...doc, photo: e.target.files[0] });

                  setPhoto(e.target.files[0]);
                }
              }}
              type="file"
              name="photo"
              id=""
              hidden
            />
          </label>
          <Button
            size="small"
            className="hover:bg-accent hover:text-text bg-text text-bng  px-6 pr-6 rounded-lg font-medium "
            variant="contained"
            type="submit"
          >
            Post
          </Button>
        </div>
      </form>
      <br />

      {isLoading && <Spinner />}
    </div>
  );
});

export default CreatePost;
