import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

interface FireBaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// const getConfigValue = (key: string): string => {
//   const value = process.env[key];
//   if (value === undefined) {
//     throw new Error("Firebase config error: Missing value for ${key}");
//   }
//   return value;
// };

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// // check user's login state

// const monitorAuthState = async () => {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       console.log("user info", user);
//       showloginstate

//       const uid = user.uid;
//     } else {
//       // user log out
//     }
//   });
// };

// // log out
// signOut(auth)
//   .then(() => {
//     console.log("log-out successful");
//   })
//   .catch((error) => {
//     console.error(error);
//   });

const firestore = getFirestore();
// const analytics = getAnalytics(app);

export { firestore, auth };
