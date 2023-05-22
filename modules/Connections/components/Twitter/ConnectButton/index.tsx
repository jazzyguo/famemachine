import React from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import { TWITCH_API_AUTH_URL } from "@/lib/consts/api";
import { TWITCH_CLIENT_ID } from "@/lib/consts/config";

import styles from "../../../Connections.module.scss";

const TwitterConnectButton = () => {
    const router = useRouter();

    const handleTwitterAuth = () => {
        
    }

    return (
        <button
            onClick={handleTwitterAuth}
            className={cx(styles.button, styles["button--connect"])}
        >
            Connect
        </button>
    );
};

export default TwitterConnectButton;
