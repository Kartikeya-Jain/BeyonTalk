// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTbN6eHu26AXROOsMeJqw0dPtfiygzvbE",
  authDomain: "beyontalk.firebaseapp.com",
  projectId: "beyontalk",
  storageBucket: "beyontalk.appspot.com",
  messagingSenderId: "1040229485633",
  appId: "1:1040229485633:web:b2272584a3d6de0ffbcac0",
  measurementId: "G-4JHCGZ3LL9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};
export default db;