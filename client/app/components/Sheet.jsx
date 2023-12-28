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
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
const MySheet = memo(({ commentRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const token = useSelector((state) => state.globalSlice.token);
  const user = useSelector((state) => state.globalSlice.user);
  const [commentPost] = useMutation(COMMENT_POST, {
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
  const commentRequestPostID = useSelector(
    (state) => state.globalSlice.commentRequestPostID
  );
  console.log("what a data", commentRequestPostID);

  useEffect(() => {
    if (commentRequestPostID) {
      refetch({
        variables: { id: commentRequestPostID },
      });
    }
  }, [commentRequestPostID]);
  useEffect(() => {
    if (commentData) {
      setComments(commentData.getPostById.comments);
    }
  }, [commentData]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button ref={commentRef} className="hidden" variant="outline">
          Open
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-bng text-text overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="">
          <div className="comments">
            {comments?.map((comment, ind) => {
              console.log("comment author photo : ", comment);
              return (
                <div>
                  <p className="flex items-center">
                    <span>
                      <img
                        className="w-[40px] h-[40px] rounded-full"
                        src={comment?.photo}
                        alt=""
                      />
                    </span>
                    <span>{comment?.name}</span>
                  </p>
                  <p className="pl-10">{comment?.comment}</p>
                </div>
              );
            })}
          </div>
          <div className="comment-form">
            <textarea
              className=" border-2 border-gray-300 p-3 w-full rounded-lg outline-none bg-bng text-text"
              rows="2"
              placeholder="Write a commnent ..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              name="comment"
              type="text"
            ></textarea>
            <p>
              <Button
                onClick={() => {
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
                    },
                  });
                  setComment("");
                }}
                className="bg-accent text-text"
                variant="contained"
              >
                Comment
              </Button>
            </p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="hidden" type="submit">
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});

export default MySheet;
