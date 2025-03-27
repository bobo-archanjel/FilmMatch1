// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAetCLmaNFdyutzjc7vQX8vBF7FhJ7v8iM",
  authDomain: "filmmatch-5eefd.firebaseapp.com",
  projectId: "filmmatch-5eefd",
  storageBucket: "filmmatch-5eefd.firebasestorage.app",
  messagingSenderId: "762068130883",
  appId: "1:762068130883:web:abe6dde8b9b2ad4f8248f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});