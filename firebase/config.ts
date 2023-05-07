import { initializeApp, getApps } from "firebase/app";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: publicRuntimeConfig.FIREBASE_API_KEY,
    authDomain: publicRuntimeConfig.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: publicRuntimeConfig.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: publicRuntimeConfig.FIREBASE_MESSAGING_ID,
    appId: publicRuntimeConfig.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);

export default app;
