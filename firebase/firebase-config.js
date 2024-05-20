// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyAE48LD9ISV1nFanzXtvXouEBXMJFyDz7g",
    authDomain: "fitness-tracking-app-c114f.firebaseapp.com",
    projectId: "fitness-tracking-app-c114f",
    storageBucket: "fitness-tracking-app-c114f.appspot.com",
    messagingSenderId: "21253984207",
    appId: "1:21253984207:web:717f9ffcf65bb6346b0cba",
    databaseURL: "https://fitness-tracking-app-c114f-default-rtdb.europe-west1.firebasedatabase.app/"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);