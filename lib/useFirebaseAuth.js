import { useState, useEffect } from 'react'
import app from './firebase';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
  emailVerified: user.emailVerified,
  phoneNumber: user.phoneNumber,
  photoURL: user.photoURL,
  token: user.accessToken
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState) => {
    //console.log("authStateChanged",authState)
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return;
    }

    setLoading(true)
    console.log('authStateChanged',authState)
    //console.log(authState.auth.currentUser.getIdToken().then(data=>console.log(data)))
    let formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };
  const auth = getAuth(app);
  // listen for Firebase state change
  // console.log(auth)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, [auth]);
  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const SignIn = async (email, password) => {
    //console.log('Hello Login',auth,email, password)
    return signInWithEmailAndPassword(auth, email, password)
  }
  const SignUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const SignOut = async () =>
    signOut(auth)
      .then(clear);

  const SendEmailVerification=()=>
    sendEmailVerification(auth.currentUser);
  const UpdateProfile=(displayName,photoURL='')=>
  updateProfile(auth.currentUser,{
    displayName,
    photoURL
  })
  const Reload=()=>{
    let formattedUser = formatAuthUser(auth?.currentUser);
    setAuthUser(formattedUser);
    setLoading(false);
    return auth?.currentUser.reload()
  }
  // useEffect(()=>{
  //   console.log(auth)
  // })
  return {
    ...authUser,
    loading,
    SignIn,
    SignUp,
    SignOut,
    SendEmailVerification,
    UpdateProfile,
    Reload
    };
}