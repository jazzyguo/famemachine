import React, { useState } from "react";
import cx from "classnames";

import { useAuth } from "@/contexts/AuthContext";
import {
    useConnectionsAPI,
} from "@/contexts/ConnectionsContext";
import { ATHENA_API_URL } from "@/lib/consts/api";

import styles from "../../../Connections.module.scss";

const TwitterDisconnectButton = () => {
    const [error, setError] = useState<string>('')
    const { user } = useAuth();
    const { addConnection } = useConnectionsAPI();

    const removeTwitterConnection = async () => {
        if (user) {
            try {
                setError('')
                
                const response = await fetch(`${ATHENA_API_URL}connect/twitter/auth?user_id=${user.uid}`
                    , {
                        method: "DELETE",
                    });

                if (response.status === 200) {
                    console.log("Twitter connection removed successfully.");
                    addConnection("twitter", null);
                }
            } catch (e: any) {
                const error = "Error removing Twitter connection, please try again"
                console.error(e);
                setError(error)
            }
        }
    };

    return (
        <>
            <button
                className={cx(styles.button, styles["button--disconnect"])}
                onClick={() => removeTwitterConnection()}
            >
                Disconnect
            </button>
            {error && <span className={styles.button_error}>{error}</span>}
        </>
    );
};

export default TwitterDisconnectButton;
