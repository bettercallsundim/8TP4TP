"use client";
import { getDataFromLocal, removeDataFromLocal } from "@/utils/localStorage";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { logOut, setSocket, setToken, setUser } from "../redux/globalSlice";

const UserContext = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [jwt_token, setJwt_Token] = useState(null);

  const router = useRouter();
  const tokenizedSignInGql = gql`
    query TokenizedSignIn {
      tokenizedSignIn
    }
  `;
  const dispatch = useDispatch();
  const [refetch, { loading, error, data: isTokenValid }] = useLazyQuery(
    tokenizedSignInGql,
    {
      context: {
        headers: {
          authorization: `Bearer ${jwt_token}`,
        },
      },
    }
  );

  useEffect(() => {
    if (jwt_token) {
      refetch();
    }
  }, [jwt_token]);
  useEffect(() => {
    const tokenData = getDataFromLocal("token");
    if (tokenData?.token) setJwt_Token(tokenData.token);
  }, []);
  useEffect(() => {
    if (isTokenValid?.tokenizedSignIn == "invalid") {
      dispatch(logOut());
      removeDataFromLocal("token");
      removeDataFromLocal("user");
      setJwt_Token(null);
      return;
    } else if (isTokenValid?.tokenizedSignIn == "valid" && jwt_token) {
      const user = getDataFromLocal("user");
      if (user) {
        dispatch(setUser(user));
        dispatch(setToken({ token: jwt_token }));
      }
    }
  }, [isTokenValid, jwt_token]);

  return children;
};

export default UserContext;
