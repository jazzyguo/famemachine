import React from "react";
import cx from "classnames";
import { ATHENA_API_URL } from "@/lib/consts/api";
import { useAuth } from "@/contexts/AuthContext";

import styles from "../../../Connections.module.scss";

const TwitterConnectButton = () => {
    const { user } = useAuth()

    const handleTwitterAuth = async () => {
        try {
            const response = await fetch(`${ATHENA_API_URL}connect/twitter/auth`, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                }
            });

            if (response.ok) {
                const data = await response.json()
                window.location.href = data.redirect_url
            } else {
                throw new Error('Error with twitter auth')
            }
        } catch (e: any) {
            console.error(e);
        }
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
