"use client";

import { getDataFromLocal, setDataToLocal } from "@/utils/localStorage";
import { gql, useMutation } from "@apollo/client";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../redux/globalSlice";
export default function Login() {
  const dispatch = useDispatch();
  const [tokenData, setTokenData] = useState(null);
  const userFromState = useSelector((state) => state.globalSlice.user);
  const router = useRouter();
  const addUser = gql`
    mutation signIn(
      $email: String!
      $googleId: String!
      $name: String!
      $picture: String!
    ) {
      signIn(
        name: $name
        googleId: $googleId
        picture: $picture
        email: $email
      ) {
        token
        _id
      }
    }
  `;

  const [signIn] = useMutation(addUser, {
    onError: (err) => {
      console.log(err);
    },
  });
  useEffect(() => {
    const { token: gotToken } = getDataFromLocal("token");
    if (gotToken) {
      setTokenData(gotToken);
    }
  }, []);
  if (!tokenData || !userFromState?.email) {
    return (
      <div className="my-auto mx-auto">
        <Toaster
          toastOptions={{
            className: "",
            position: "top-right",
          }}
        />

        <GoogleLogin
          onSuccess={({ credential }) => {
            const notify = () =>
              toast.success("Logged in successfully. Redirecting...");
            notify();
            const decoded = jwtDecode(credential);
            dispatch(setUser(decoded));
            const { email, name, picture, sub: id } = decoded;
            signIn({
              variables: {
                name,
                email,
                picture,
                googleId: id,
              },
              update: (
                cache,
                {
                  data: {
                    signIn: { token: newToken, _id },
                  },
                }
              ) => {
                dispatch(setToken({ token: newToken }));
                setTokenData(newToken);
                setDataToLocal("token", { token: newToken });
                setDataToLocal("user", {
                  name,
                  email,
                  picture,
                  googleId: id,
                  _id: _id,
                });

                dispatch(
                  setUser({ name, email, picture, googleId: id, _id: _id })
                );
              },
            });

            router.push("/feed");
          }}
          onError={() => {
            const notifyFail = () => toast.error("Logged in failed");
            notifyFail();
          }}
        />
      </div>
    );
  }
}
