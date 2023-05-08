import React from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/contexts/AuthContext";

import styles from "./Home.module.scss";

const HomeModule = () => {
    const router = useRouter();
    const { user } = useAuthContext();

    if (user) {
        router.push("/videos");
        return null;
    }

    return (
        <div className={styles.container}>
            <p>Sign up to get started!</p>
            <p>
                You can then upload a video to process, or link your twitch
                account to retrieve videos!
            </p>
            <p>
                To publish a video, you must connect one of the following social
                media accounts: Twitter
            </p>
        </div>
    );
};

export default HomeModule;
