import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for user
      const docRef = doc(db, "users", user.uid);
      const docSnapshot = await getDoc(docRef);

      //If user doesnt exist, create user
      if (!docSnapshot.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error(`Error signing in with Google: ${error.message}`);
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/signup" ? "up" : "in"} with </p>
      <button className="socialIconDiv">
        <img
          src={googleIcon}
          alt="google icon"
          className="socialIconImg"
          onClick={onGoogleClick}
        />
      </button>
    </div>
  );
}

export default OAuth;
