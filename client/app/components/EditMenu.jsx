"use client";

import { gql, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
const DELETE_POST = gql`
  mutation deletePost($id: String!, $_id: String!) {
    deletePost(id: $id, _id: $_id)
  }
`;
export default function EditMenu({
  editMenuOpen,
  setEditMenuOpen,
  editMenuRef,
  commentRef,
  postId,
  refetch,
}) {
  const token = useSelector((state) => state.globalSlice.token);

  const user = useSelector((state) => state.globalSlice.user);
  const [deletePost, { error, loading: deletingPost }] = useMutation(
    DELETE_POST,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    }
  );
  return (
    <div
      className={
        editMenuOpen
          ? `rounded-lg border border-text w-1/2 bg-bng text-text absolute z-[9999999999] top-4 right-4 p-4`
          : "hidden"
      }
    >
      <button
        onClick={() => {
          commentRef.current.click();
        }}
        className="hover:bg-text hover:text-bng w-full duration-300 rounded-md"
      >
        Edit
      </button>
      <button
        onClick={() => {
          deletePost({
            variables: {
              id: postId,
              _id: user?._id,
            },
            update: () => {
              if(refetch) refetch();
            },
          });

        }}
        className="hover:bg-text hover:text-bng w-full duration-300 rounded-md"
      >
        Delete
      </button>
    </div>
  );
}
