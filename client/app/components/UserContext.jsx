"use client";
import { getDataFromLocal, removeDataFromLocal } from "@/utils/localStorage";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logOut, setToken, setUser } from "../redux/globalSlice";
function delay(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
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
    // else refetch();
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
      console.log(jwt_token, "jwt_token");
      dispatch(logOut());
      removeDataFromLocal("token");
      removeDataFromLocal("user");
      // router.push("/");
      return;
    } else {
      const user = getDataFromLocal("user");
      delay(0.5);
      if (user) {
        dispatch(setUser(user));
        dispatch(setToken({ token: jwt_token }));
      }
    }
  }, [isTokenValid]);
  console.log("🚀 ~ useEffect ~ jwt_token:", jwt_token);

  return children;
};

export default UserContext;
