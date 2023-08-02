import React from "react";
import cx from "classnames";
import { ATHENA_API_URL } from "@/lib/consts/api";
import { useAuth } from "@/contexts/AuthContext";

import styles from "../../../Connections.module.scss";

const YouTubeConnectButton = () => {
    const { user } = useAuth()

    const handleYouTubeAuth = async () => {
        try {
         
        } catch (e: any) {
            console.error(e);
        }
    }

    return (
        <button
            onClick={handleYouTubeAuth}
            className={cx(styles.button, styles["button--connect"])}
        >
            Connect
        </button>
    );
};

export default YouTubeConnectButton;
