// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "redacted",
    authDomain: "redacted",
    projectId: "redacted",
    storageBucket: "redacted",
    messagingSenderId: "redacted",
    appId: "redacted"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

// File storage
const storage = getStorage(app);

export { auth, db, storage }
