
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC3QQB7XsAhmDNCHnCuI52U1daaCcU6H9I",
    authDomain: "realmeasure-auth.firebaseapp.com",
    projectId: "realmeasure-auth",
    storageBucket: "realmeasure-auth.firebasestorage.app",
    messagingSenderId: "217345699178",
    appId: "1:217345699178:web:4566e723fa8bd619d04913",
    measurementId: "G-F7WF128F12"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
