import React, { useState } from "react";
import cx from "classnames";

import { useAuth } from "@/contexts/AuthContext";
import {
    useConnectionsAPI,
} from "@/contexts/ConnectionsContext";
import { ATHENA_API_URL } from "@/lib/consts/api";

import styles from "../../../Connections.module.scss";

const YouTubeDisconnectButton = () => {
    const [error, setError] = useState<string>('')
    const { user } = useAuth();
    const { addConnection } = useConnectionsAPI();

    const removeYouTubeConnection = async () => {
        if (user.uid) {
            try {
                setError('')
            } catch (e: any) {
                const error = "Error removing YouTube connection, please try again"
                console.error(e);
                setError(error)
            }
        }
    };

    return (
        <>
            <button
                className={cx(styles.button, styles["button--disconnect"])}
                onClick={() => removeYouTubeConnection()}
            >
                Disconnect
            </button>
            {error && <span className={styles.button_error}>{error}</span>}
        </>
    );
};

export default YouTubeDisconnectButton;
