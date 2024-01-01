"use client";
import { getDataFromLocal, removeDataFromLocal } from "@/utils/localStorage";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logOut, setToken, setUser } from "../redux/globalSlice";

const UserContext = ({ children }) => {
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
      console.log("lol token", jwt_token);
      refetch();
    }
  }, [jwt_token]);
  useEffect(() => {
    const { token } = getDataFromLocal("token");
    if (token) setJwt_Token(token);
    else refetch();
  }, []);
  console.log("isTokenValid", isTokenValid);
  useEffect(() => {
    console.log(
      isTokenValid?.tokenizedSignIn,
      "isTokenValid?.tokenizedSignIn "
    );
    // || (!jwt_token && isTokenValid?.tokenizedSignIn == "invalid")
    if (
      (jwt_token || !jwt_token) &&
      isTokenValid?.tokenizedSignIn == "invalid"
    ) {
      // const notify = () => toast.success("Invalid Token");
      // notify();
      dispatch(logOut());
      removeDataFromLocal("token");
      removeDataFromLocal("user");
      // router.push("/");
      return;
    } else {
      const user = getDataFromLocal("user");
      if (user) {
        dispatch(setUser(user));
        dispatch(setToken({ token: jwt_token }));
      }
    }
  }, [isTokenValid]);
  return children;
};

export default UserContext;
