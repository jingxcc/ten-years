import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#e0f2fe",
          color: "#737373",
          fontWeight: "500",
        },
      }}
    ></Toaster>
  );
};
