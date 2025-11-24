"use client";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { app } from "./firebase";
import { authService } from "@/services/authService";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in using Google popup
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  const credential = await signInWithPopup(auth, googleProvider);
  const token = await credential.user.getIdToken();

  // Store token for frontend API
  localStorage.setItem("ochiga_token", token);
  localStorage.setItem("ochiga_role", "resident"); // default for Google users
  return credential;
}

/**
 * Sign up using email and password (Firebase + backend sync)
 */
export async function signupWithEmail(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const token = await credential.user.getIdToken();

  localStorage.setItem("ochiga_token", token);
  localStorage.setItem("ochiga_role", "resident");
  return credential;
}

/**
 * Login using email/password
 */
export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const token = await credential.user.getIdToken();

  localStorage.setItem("ochiga_token", token);
  localStorage.setItem("ochiga_role", "resident");
  return credential;
}

/**
 * Logout
 */
export function logout() {
  localStorage.removeItem("ochiga_token");
  localStorage.removeItem("ochiga_role");
  return auth.signOut();
}
