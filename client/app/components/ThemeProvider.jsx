"use client";
import { memo } from "react";
import { Toaster } from "react-hot-toast";
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
