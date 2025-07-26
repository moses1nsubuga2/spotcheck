import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function createPin(pin) {
  return await addDoc(collection(db, "pins"), pin);
}

export async function updatePin(id, pin) {
  return await updateDoc(doc(db, "pins", id), pin);
}

export async function deletePin(id) {
  return await deleteDoc(doc(db, "pins", id));
}

export async function getPins() {
  const snapshot = await getDocs(collection(db, "pins"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function searchPinsByActivity(activity) {
  const q = query(collection(db, "pins"), where("activity", "==", activity));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
