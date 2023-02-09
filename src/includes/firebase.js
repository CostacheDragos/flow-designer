// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRwMTSRBAarEcjFao4d9kfj-ZSxW-jLkk",
    authDomain: "flow-editor-1c110.firebaseapp.com",
    projectId: "flow-editor-1c110",
    storageBucket: "flow-editor-1c110.appspot.com",
    messagingSenderId: "290469999476",
    appId: "1:290469999476:web:d03d94c70cd72540643221"
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
