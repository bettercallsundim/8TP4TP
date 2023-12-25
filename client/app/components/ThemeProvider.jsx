"use client";
import { getDataFromLocal } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { memo, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/globalSlice";
const ThemeProvider = memo(({ children }) => {
  
  return (
    <div>
      {" "}
      <Toaster
        toastOptions={{
          className: "",
          position: "top-right",
        }}
      />
      {children}
    </div>
  );
});

export default ThemeProvider;
