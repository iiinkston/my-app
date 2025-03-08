import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // Add getDocs here
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBgj4s183WMwPfzgQU8ro-BDU58aXk8CUY",
    authDomain: "dietapp-ed5e5.firebaseapp.com",
    projectId: "dietapp-ed5e5",
    storageBucket: "dietapp-ed5e5.firebasestorage.app",
    messagingSenderId: "761307949826",
    appId: "1:761307949826:web:04d45ef1419829ba63f01b",
    measurementId: "G-DSET4W8086"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Get Firestore instance
const auth = getAuth(app); // Get Auth instance
const storage = getStorage(app); // Get Storage instance

// Exporting Firestore methods
export { db, auth, storage, collection, addDoc, getDocs }; // Include getDocs here