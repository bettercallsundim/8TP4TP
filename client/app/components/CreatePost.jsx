"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toaster } from "@/components/ui/toaster";
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
  const [category, setCategory] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const user = useSelector((state) => state.globalSlice.user);
  const token = useSelector((state) => state.globalSlice.token);

  const addPost = gql`
    mutation addPost(
      $post: String!
      $photo: String
      $email: String!
      $category: String!
    ) {
      addPost(post: $post, photo: $photo, email: $email, category: $category) {
        post
        photo
        time
        name
        authorPhoto
        category
      }
    }
  `;
  const [postStatus] = useMutation(addPost, {
    onError: (err) => {
      setLoading(false);
      console.log(err);
    },
    context: {
      headers: {
        authorization: "Bearer " + token,
      },
    },
  });
  async function uploadPost(e) {
    e.preventDefault();

    // if user uploads a photo
    if (fileRef.current.files.length > 0 && doc.photo && category) {
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
          if (user?.email && token) {
            postStatus({
              variables: {
                post: doc.post,
                photo: res.data.secure_url,
                email: user?.email,
                category,
              },

              update: (
                cache,
                {
                  data: {
                    addPost: { post, name, time, photo, authorPhoto, category },
                  },
                }
              ) => {
                refetch();
                setLoading(false);
                setPhotoURL("");
              },
            });
            setDoc({ post: "", photo: "" });
            setCategory(null);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
      fileRef.current.value = "";
    } else {
      if (!doc.post && !category) {
        return;
      }
      setLoading(true);

      postStatus({
        variables: {
          post: doc.post,
          email: user.email,
          category,
        },
        update: (
          cache,
          {
            data: {
              addPost: { post, name, time, authorPhoto, category },
            },
          }
        ) => {
          refetch();
          setLoading(false);
        },
      });
      console.log("here", category);
      setDoc({ post: "", photo: "" });
      setCategory(null);
    }
  }
  useEffect(() => {
    // const gotUser = getDataFromLocal("user");
    // const { token: gotToken } = getDataFromLocal("token");
    // if (gotUser) setUser(gotUser);
    // if (gotToken) setToken(gotToken);
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
        <div>
          <RadioGroup className="option-one flex items-center my-2">
            <div
              onClick={() => setCategory("Street Food")}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Street food</Label>
            </div>
            <div
              onClick={() => setCategory("Restaurant")}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Restaurant</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex items-center gap-x-4">
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
            className="hover:bg-secondary hover:text-text bg-text text-bng py-1  px-4 dark:hover:bg-pink-400  rounded-lg font-medium "
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
