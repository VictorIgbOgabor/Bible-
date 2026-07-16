import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { auth, googleProvider } from "./firebase";
import { ensureUserProfile } from "./userData";

const isNative = Capacitor.isNativePlatform();

export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = checking, null = signed out

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          await ensureUserProfile(u);
        } catch (e) {
          console.error("Failed to create profile", e);
        }
      }
      setUser(u);
    });
    return unsub;
  }, []);

  const signIn = async () => {
    if (isNative) {
      // Web-based popup/redirect sign-in doesn't work reliably inside a
      // Capacitor WebView, so on native platforms we use the device's real
      // Google Sign-In flow, then bridge the resulting credential into the
      // Firebase JS SDK auth instance (which Firestore reads/writes rely
      // on) via signInWithCredential.
      const result = await FirebaseAuthentication.signInWithGoogle();
      const idToken = result.credential?.idToken;
      if (!idToken) {
        throw new Error("No ID token returned from native Google sign-in");
      }
      const credential = GoogleAuthProvider.credential(idToken);
      return signInWithCredential(auth, credential);
    }
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    if (isNative) {
      await FirebaseAuthentication.signOut();
    }
    return signOut(auth);
  };

  return { user, loading: user === undefined, signIn, logOut };
}
