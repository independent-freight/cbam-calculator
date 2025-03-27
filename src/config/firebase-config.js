// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB_iWYCM7yZj465imzWMeTi7O372eo85O0",
    authDomain: "cbam-calculator.firebaseapp.com",
    projectId: "cbam-calculator",
    storageBucket: "cbam-calculator.firebasestorage.app",
    messagingSenderId: "670959799840",
    appId: "1:670959799840:web:b20b935a44c38bd501b645",
    measurementId: "G-LEJH5CY2Z6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
