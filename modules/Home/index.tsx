import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

import styles from "./Home.module.scss";

const HomeModule = () => {
    const router = useRouter();
    const { user } = useAuth();

    if (user) {
        router.push("/videos");
        return null;
    }

    return (
        <div className={styles.container}>
            <p>Sign up to get started!</p>
            <p>
                You can then link your twitch video to process videos!
            </p>
            <p>
                To publish a video, you must connect one of the following social
                media accounts: Twitter
            </p>
        </div>
    );
};

export default HomeModule;
