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
  const userFromState = useSelector((state) => state.globalSlice);
  const router = useRouter();
  const { token } = getDataFromLocal("token");

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
    // alert(data);
    // const notifyAlreadyLoggedIn = () =>
    //   toast.success("Logged in successfully. Redirecting...");
    // notifyAlreadyLoggedIn();
    // dispatch(setUser(user));
    // router.push("/feed");
  }, []);
  if (!token) {
    return (
      <div>
        <Toaster
          toastOptions={{
            className: "",
            position: "top-right",
          }}
        />

        {!userFromState?.id && (
          <GoogleLogin
            onSuccess={({ credential }) => {
              const notify = () =>
                toast.success("Logged in successfully. Redirecting...");
              notify();
              const decoded = jwtDecode(credential);
              console.log("decodeee", decoded);
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
                      signIn: { token, _id },
                    },
                  }
                ) => {
                  console.log("token", token);
                  setDataToLocal("token", { token });
                  dispatch(setToken({ token }));
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
            useOneTap
          />
        )}
      </div>
    );
  }
}
