"use client";
import SignUpForm from "./SignUpForm";
import { auth } from "@/lib/firebase/initialize";
import { AuthErrorCodes, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import createUserDocument from "@/lib/firebase/firestore/createUserDocument";
import toast from "react-hot-toast";
import Header from "@/components/Header/Header";

// const getAuthErrorMsg = (error: FirebaseError): string => {
//   console.log(error);

//   if (error.code == AuthErrorCodes.INVALID_APP_CREDENTIAL) {
//     return "Incorrect Password";
//   } else {
//     return error.message;
//   }
// };

export default function SignUpPage() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [slideIn, setSlideIn] = useState<Boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/signup") {
      setSlideIn(true);
    }
  }, [router]);

  const handleSignUp = async (
    email: string,
    password: string,
  ): Promise<void> => {
    console.log("handleSignUp: ", email, password);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      console.log("Sign up user", userCredential.user);
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };

      createUserDocument(user);

      toast.success("Signup success", { position: "top-center" });
      router.push("/get-start");
    } catch (error) {
      if (error instanceof FirebaseError) {
        let msg = "";
        if (error.code === "auth/email-already-in-use") {
          msg = "Account already exists";
        } else if (error.code === "auth/weak-password") {
          msg = "Password should be at least 6 characters";
        } else {
          msg = error.message;
        }

        setErrorMsg(msg);
      } else if (error instanceof Error) {
        console.error(`Sign-up Error: ${error.message}`);
      } else {
        console.log(`Sign-up Error: ${error}`);
      }
    }
  };

  return (
    <div
      className={`${slideIn ? "animate-slide-in" : ""} min-h-screen bg-sky-200`}
    >
      <SignUpForm onSignUp={handleSignUp} errorMsg={errorMsg} />
    </div>
  );
}
