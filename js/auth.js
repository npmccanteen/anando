// js/auth.js
import { auth, googleProvider } from "./firebase-config.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed: " + err.message);
  }
}

export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}

export function watchAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
