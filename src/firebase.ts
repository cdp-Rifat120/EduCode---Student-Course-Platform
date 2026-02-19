import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUYKe2nCfhr6yRCK68YbK1lLAhgK0tpCY",
  authDomain: "edu-studious.firebaseapp.com",
  projectId: "edu-studious",
  storageBucket: "edu-studious.firebasestorage.app",
  messagingSenderId: "469569704239",
  appId: "1:469569704239:web:359d79896a54478cb1d1da",
  measurementId: "G-GSBXSFCTZQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
