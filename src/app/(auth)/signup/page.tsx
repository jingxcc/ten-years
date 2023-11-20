"use client";
import SignUpForm from "./SignUpForm";
import { auth } from "@/lib/firebase/initialize";
import { AuthErrorCodes, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      const user = userCredential.user;
      console.log(user);

      alert("Signup success");
      router.push("/get-start");
    } catch (error) {
      if (error instanceof FirebaseError) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const errorMessage = getAuthErrorMsg(error);
        setErrorMsg(error.message);
      } else {
        console.log(`Sign-up Error: ${error}`);
      }
    }
  };

  return (
    <>
      <SignUpForm onSignUp={handleSignUp} errorMsg={errorMsg} />
    </>
  );
}
