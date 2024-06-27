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

const SearchUsers = () => {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

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

  return (
    <div className="relative w-full">
      <input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Search users..."
        className="w-full py-1 px-4 border-2 border-gray-300 rounded-lg outline-none bg-bng text-text"
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {search.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md z-10 px-4 py-2 flex flex-col gap-y-2">
          {data &&
            data.getUsers.map((user) => (
              <Link
                key={user._id}
                onClick={() => {
                  setSearch("");
                }}
                href={"/profile/" + user._id}
                className="hover:bg-secondary hover:text-bng duration-300 py-2 px-4 cursor-pointer"
              >
                {user.name} ({user.email})
              </Link>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUsers;
