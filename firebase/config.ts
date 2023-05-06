import { initializeApp, getApps } from "firebase/app";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

console.log("firebazSe");
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAX1CIw2ApEPqPdRNcy1rW6wc7N4qH2ecg",
    authDomain: "famemachine-dev.firebaseapp.com",
    projectId: "famemachine-dev",
    storageBucket: "famemachine-dev.appspot.com",
    messagingSenderId: "76932611515",
    appId: "1:76932611515:web:33be34b31206ed2cf7989e",
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
console.log({ app });
export default app;
