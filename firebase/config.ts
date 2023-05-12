import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_ID,
    FIREBASE_APP_ID,
} from "@/lib/consts/config";

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_ID,
    appId: FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);

export default app;
