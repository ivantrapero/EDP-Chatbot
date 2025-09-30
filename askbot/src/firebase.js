
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzvBr29wSIvlQ-Whi2zRqTuU883JnRfkc",
  authDomain: "bagutbot-dff09.firebaseapp.com",
  projectId: "bagutbot-dff09",
  storageBucket: "bagutbot-dff09.firebasestorage.app",
  messagingSenderId: "371960115899",
  appId: "1:371960115899:web:3f32d1675d2467be8cef9e",
  measurementId: "G-KHFZN539VX"
};



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };