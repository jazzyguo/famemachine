import React from "react";
import { useRouter } from "next/router";
import { signOut, getAuth } from "firebase/auth";
import app from "@/firebase/config";

const auth = getAuth(app);

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Signed out successfully");
            router.push("/");
        } catch (e) {
            console.log(e);
        }
    };

    return <button onClick={() => handleLogout()}>Log out</button>;
};

export default React.memo(LogoutButton);
