"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { DateTime } from "luxon";
import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CommentSkeleton from "./CommentSkeleton";
import Spinner from "./Spinner";
const COMMENT_POST = gql`
  mutation commentPost($id: String!, $email: String!, $comment: String!) {
    comment(id: $id, email: $email, comment: $comment) {
      name
      comment
      time
      comment_by
      photo
    }
  }
`;
const EDIT_POST = gql`
  mutation editPost($id: String!, $_id: String!, $post: String!) {
    editPost(id: $id, _id: $_id, post: $post) {
      post
    }
  }
`;
const MySheet = memo(
  ({
    commentRequestPostID,
    commentRef,
    initPost,
    setInitPost,
    isOpen,
    setIsOpen,
    sheetType,
  }) => {
    const [comment, setComment] = useState("");
    const [post, setPost] = useState(initPost?.post);
    const [comments, setComments] = useState([]);
    const token = useSelector((state) => state.globalSlice.token);
    const user = useSelector((state) => state.globalSlice.user);
    const closeSheet = useRef();
    const [commentPost, { loading: loadingNewComment }] = useMutation(
      COMMENT_POST,
      {
        onError: (err) => {
          console.log(err);
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      }
    );
    const [editPost, { loading: editPostLoading }] = useMutation(EDIT_POST, {
      onError: (err) => {
        console.log(err);
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
    const GET_POST_BY_ID = gql`
      query getPostById($id: String!) {
        getPostById(id: $id) {
          post
          comments {
            comment
            name
            time
            photo
          }
        }
      }
    `;
    const [refetch, { loading, data: commentData }] =
      useLazyQuery(GET_POST_BY_ID);

    // Function to scroll to the end of the parent element
    const lastElm = useRef(null);
    const scrollToBottom = async () => {
      function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      if (lastElm.current) {
        await delay(500);
        lastElm?.current?.scrollIntoView({ behavior: "smooth" });
      }
    };
    const array = [1, 2, 4, 5];
    useEffect(() => {
      if (commentRequestPostID && isOpen) {
        refetch({
          variables: { id: commentRequestPostID },
        });
        scrollToBottom();
      }
    }, [commentRequestPostID, isOpen]);
    useEffect(() => {
      if (commentData && isOpen) {
        setComments(commentData.getPostById.comments);
        setPost(commentData.getPostById.post);
      }
    }, [commentData]);

    useEffect(() => {
      scrollToBottom();
    }, [isOpen]);

    return (
      <div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button ref={commentRef} className="hidden" variant="outline">
              Open
            </Button>
          </SheetTrigger>
          {isOpen && sheetType == "comment" && (
            <SheetContent
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                scrollToBottom();
              }}
              className="bg-bng text-text overflow-y-scroll w-[80%]"
            >
              <SheetHeader>
                <SheetTitle>Comments</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <div className="">
                <div className="comments mt-4">
                  {loading &&
                    array?.map((_, ind) => <CommentSkeleton key={ind} />)}

                  {comments?.map((comment, ind) => {
                    console.log("comment author photo : ", comment);
                    return (
                      <div className="mb-8">
                        <p className="flex items-center gap-x-2 ">
                          <span>
                            <img
                              className="w-[40px] h-[40px] rounded-full"
                              src={comment?.photo}
                              alt=""
                            />
                          </span>
                          <p className="flex flex-col gap-1">
                            <p className="font-medium bg-primary text-white rounded-lg px-2 inline-block">
                              {comment?.name}
                            </p>
                            <p className="text-[10px] bg-slate-700 text-white rounded-lg px-2 inline-block ">
                              {DateTime.fromMillis(
                                parseInt(comment.time)
                              ).toLocaleString(DateTime.DATETIME_MED)}
                            </p>
                          </p>
                        </p>
                        <p className="mt-2 ml-12 text-text bg-sky-400 dark:text-black dark:bg-sky-300 p-2 rounded">
                          {comment?.comment}
                        </p>
                      </div>
                    );
                  })}
                  <div ref={lastElm}></div>
                </div>
                <div className="comment-form">
                  <form>
                    <textarea
                      className=" border-2 border-gray-300 p-3 w-full rounded-lg outline-none bg-bng text-text"
                      rows="2"
                      placeholder="Write a commnent ..."
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                      name="comment"
                      autofocus={false}
                    ></textarea>
                  </form>
                  <p>
                    <Button
                      onClick={() => {
                        if (!comment) return;
                        commentPost({
                          variables: {
                            id: commentRequestPostID,
                            email: user.email,
                            comment: comment,
                          },
                          update: (cache, data) => {
                            console.log("hi from comment", data);
                            const commentArray = data.data.comment;
                            setComments(commentArray);
                            setInitPost({
                              ...initPost,
                              comments: commentArray,
                            });
                            console.log("init post : ", initPost);
                          },
                        });
                        scrollToBottom();
                        setComment("");
                      }}
                      className="bg-accent text-text"
                      variant="contained"
                    >
                      Comment
                    </Button>
                    <span className="ml-2">
                      {loadingNewComment && <Spinner inline={true} />}
                    </span>
                  </p>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button ref={closeSheet} className="hidden" type="submit">
                    Save changes
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          )}
          {isOpen && sheetType == "edit" && (
            <SheetContent
              onOpenAutoFocus={(e) => {
                e.preventDefault();
              }}
              className="bg-bng text-text overflow-y-scroll w-[80%]"
            >
              <SheetHeader>
                <SheetTitle>Edit Post</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <div className="">
                <div className="comments mt-4"></div>
                <div className="comment-form">
                  <form>
                    <textarea
                      className=" border-2 border-gray-300 p-3 w-full rounded-lg outline-none bg-bng text-text"
                      rows="2"
                      placeholder="Edit post ..."
                      onChange={(e) => setPost(e.target.value)}
                      value={post}
                      name="post"
                      autofocus={false}
                    ></textarea>
                  </form>
                  <p>
                    <Button
                      onClick={() => {
                        if (!post) return;
                        editPost({
                          variables: {
                            id: commentRequestPostID,
                            _id: user._id,
                            post,
                          },
                          update: (cache, data) => {
                            console.log("hi from editPost", data);
                            const fetchedPost = data.data.post;
                            setPost(fetchedPost);
                            setInitPost({
                              ...initPost,
                              post,
                            });
                          },
                        });
                        closeSheet.current.click();
                      }}
                      className="bg-accent text-text"
                      variant="contained"
                    >
                      Edit Post
                    </Button>
                    <span className="ml-2">
                      {editPostLoading && <Spinner inline={true} />}
                    </span>
                  </p>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button ref={closeSheet} className="hidden" type="submit">
                    Save changes
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          )}
        </Sheet>
        <div></div>
      </div>
    );
  }
);

export default MySheet;
