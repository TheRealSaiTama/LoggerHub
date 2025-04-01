import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3tr5oZDntlOCTzTW8mBt1hPa7e6tNVwE",
  authDomain: "loggerproject-dc690.firebaseapp.com",
  projectId: "loggerproject-dc690",
  storageBucket: "loggerproject-dc690.firebasestorage.app",
  messagingSenderId: "338090887457",
  appId: "1:338090887457:web:25a2795a85925d46b55660",
  measurementId: "G-RE40J332N4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
