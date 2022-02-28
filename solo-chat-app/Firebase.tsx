import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_NATIVE_APP_API_KEY,
  authDomain: process.env.REACT_NATIVE_APP_AUTH_DOMAIN,
  databaseURL:  process.env.REACT_NATIVE_APP_DATABASE_URL,
  projectId:  process.env.REACT_NATIVE_APP_PROJECT_ID,
  storageBucket:  process.env.REACT_NATIVE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_NATIVE_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_NATIVE_APP_APP_ID
};
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };
