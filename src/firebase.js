import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7Y0wEqaN1STIsS2vIpRBVWOTDm5FsRrE",
  authDomain: "mini-project-3a996.firebaseapp.com",
  projectId: "mini-project-3a996",
  storageBucket: "mini-project-3a996.appspot.com",
  messagingSenderId: "121661191164",
  appId: "1:121661191164:web:e206c99685d929cbcef879",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore와 Auth 초기화
const db = getFirestore(app);
const auth = getAuth(app);

// db와 auth 내보내기
export { db, auth, app };
