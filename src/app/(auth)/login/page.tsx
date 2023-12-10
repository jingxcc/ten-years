"use client";
import LoginForm from "./LoginForm";
import { auth } from "@/lib/firebase/initialize";
import { AuthErrorCodes, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header/Header";

// user-friendly message
// const getAuthErrorMsg = (error: FirebaseError): string => {
//   console.log(error);

//   if (error.code == AuthErrorCodes.INVALID_APP_CREDENTIAL) {
//     return "Incorrect Password";
//   } else {
//     return error.message;
//   }
// };

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const route = useRouter();

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      toast.success("Login success", { position: "top-center" });
      route.push("/chat");
    } catch (error) {
      if (error instanceof FirebaseError) {
        let msg = "";
        if (error.code === "auth/invalid-login-credentials") {
          msg = "Incorrect email or password";
        } else {
          msg = error.message;
        }

        setErrorMsg(msg);
      } else if (error instanceof Error) {
        console.error(`Log in Error: ${error.message}`);
      } else {
        console.error(`Log in Error: ${error}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-sky-200">
      <Header showNav={false}></Header>
      <LoginForm onLogin={handleLogin} errorMsg={errorMsg} />
    </div>
  );
}
