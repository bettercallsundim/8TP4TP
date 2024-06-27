import { gql, useLazyQuery, useQuery } from "@apollo/client";
import debounce from "lodash/debounce";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";

const GET_USERS = gql`
  query GetUsers($search: String!) {
    getUsers(search: $search) {
      _id
      name
      email
      picture
    }
  }
`;

const SearchUsers = ({ setShowMenu }) => {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [show, setShow] = React.useState(false);

  const [refetch, { loading, error, data }] = useLazyQuery(GET_USERS);

  // Use useCallback to memoize the debounced function
  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search, debouncedSetSearch]);

  useEffect(() => {
    if (!loading && debouncedSearch.length > 0) {
      refetch({
        variables: {
          search: debouncedSearch,
        },
      });
    }
  }, [debouncedSearch, loading, refetch]);
  useEffect(() => {
    setShow(true);
  }, [debouncedSearch, data]);

  return (
    <div className="relative w-full">
      <input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Search users..."
        className="w-full py-2 px-4 border border-gray-500 rounded-lg outline-none bg-bng text-text"
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {show && search.length > 0 && (
        <ul className="absolute z-[100] top-full left-0 w-full bg-[var(--background)] text-[var(--text)] shadow-lg rounded-md  px-4 py-2 flex flex-col gap-y-2 border-gray-600">
          {data &&
            data.getUsers.map((user) => (
              <Link
                key={user._id}
                onClick={() => {
                  setSearch("");
                  setShow(false);
                  setShowMenu && setShowMenu(false);
                }}
                href={"/profile/" + user._id}
                className="hover:bg-secondary rounded-lg  duration-300 py-2 px-4 cursor-pointer text-[var(--text)] flex items-center gap-x-2 border-b border-accent"
              >
                <img className="w-8 h-8 rounded-full" src={user.picture} />
                <span>{user.name}</span>
              </Link>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUsers;
