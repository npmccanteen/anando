// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCV1lsgvGVq66O1aId4lxm0YjrAW54b6WU",
  authDomain: "anando-ee1df.firebaseapp.com",
  projectId: "anando-ee1df",
  storageBucket: "anando-ee1df.firebasestorage.app",
  messagingSenderId: "530257917831",
  appId: "1:530257917831:web:39a8718ddfa0d2f8eac522"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});
