"use client";
import { auth } from "@/lib/firebase/initialize";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header/Header";
import AuthBaseForm from "@/components/AuthBaseForm/AuthBaseForm";

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const route = useRouter();

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      setErrorMsg("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // const user = userCredential.user;

      toast.success("Login success", { position: "top-center" });
      route.push("/chat");
    } catch (error) {
      let msg = "";
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-login-credentials") {
          msg = "Incorrect email or password";
        } else {
          msg = error.message;
        }
      } else if (error instanceof Error) {
        msg = error.message;
        console.error(`Login Error: ${msg}`);
      } else {
        msg = "Unknown Error";
        console.error(`Login Error: ${error}`);
      }
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen bg-sky-200">
      <Header showNav={false}></Header>
      <AuthBaseForm
        formType="Login"
        defaultValues={{ email: "test01@test.com", password: "000000" }}
        formTitle="Log In"
        btnContent="Log In"
        errorMsg={errorMsg}
        onFormSubmit={handleLogin}
      ></AuthBaseForm>
    </div>
  );
}
