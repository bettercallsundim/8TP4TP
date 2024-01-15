"use client";

export default function EditMenu({
  editMenuOpen,
  setEditMenuOpen,
  editMenuRef,
  commentRef,
}) {
  return (
    <div
      className={
        editMenuOpen
          ? `rounded-lg border border-text w-1/2 bg-bng text-text absolute top-4 right-4 p-4`
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
      <button className="hover:bg-text hover:text-bng w-full duration-300 rounded-md">
        Delete
      </button>
    </div>
  );
}
