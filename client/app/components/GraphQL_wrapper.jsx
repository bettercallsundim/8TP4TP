"use client";
import { getDataFromLocal, removeDataFromLocal } from "@/utils/localStorage";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/globalSlice";

const GraphQL_wrapper = ({ children }) => {
  const { token } = getDataFromLocal("token");
  const [jwt_token, setJwt_Token] = useState(token);
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
  // if (!data?.tokenizedSignIn || !jwt_token) {
  //   removeDataFromLocal("token");
  //   return router.push("/login");
  // }
  useEffect(() => {
    if (token) {
      console.log("lol token", token);
      setJwt_Token(token);
      refetch();
    }
  }, [jwt_token]);
  console.log("isTokenValid", isTokenValid);
  useEffect(() => {
    if (token && jwt_token && !isTokenValid?.tokenizedSignIn) {
      const notify = () => toast.success("Invalid Token");
      notify();
      dispatch(logOut());
      removeDataFromLocal("token");
      removeDataFromLocal("user");
      router.push("/");
      return;
    }
  }, [isTokenValid]);
  return children;
};

export default GraphQL_wrapper;
