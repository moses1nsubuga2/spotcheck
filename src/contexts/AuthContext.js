import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // 'business' or 'customer'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch role from Firestore user profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          // Default to customer if not set
          setRole("customer");
        }
      } else {
        setRole(null);
      }
    });
    return unsubscribe;
  }, []);

  // Helper to set role (call after registration or admin change)
  const setUserRole = async (uid, role) => {
    await setDoc(doc(db, "users", uid), { role }, { merge: true });
    setRole(role);
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}
