import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { HOME_URL } from "@/lib/consts";

import styles from "./Home.module.scss";

const HomeModule = () => {
    const router = useRouter();
    const { user } = useAuth();

    if (user.uid) {
        router.push(HOME_URL);
        return null;
    }

    return (
        <div className={styles.container}>
            <p>Sign up to get started!</p>
            <p>
                You can then link your twitch account to retrieve and process videos!
            </p>
            <p>
                To publish a video, you must connect one of the following social
                media accounts: Twitter
            </p>
        </div>
    );
};

export default HomeModule;
