import React from "react";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "@/firebase/config";
import cx from "classnames";

import { useAuth } from "@/contexts/AuthContext";
import {
    useConnectionsAPI,
    useConnections,
} from "@/contexts/ConnectionsContext";
import { TWITCH_API_AUTH_URL } from "@/utils/consts/api";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

import styles from "../../../Connections.module.scss";

const TwitchDisconnectButton = () => {
    const { user } = useAuth();
    const connections = useConnections();
    const { addConnection } = useConnectionsAPI();

    const { access_token: accessToken } = connections.twitch;

    const revokeAccessToken = async () => {
        try {
            const response = await fetch(`${TWITCH_API_AUTH_URL}/revoke`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `client_id=${publicRuntimeConfig.TWITCH_CLIENT_ID}&token=${accessToken}`,
            });

            if (response.status === 200) {
                console.log("Revoked twitch access token");
            }
        } catch (e) {
            console.log(e);
        }
    };

    // revoke twitch access token
    // update firestore
    // refresh current connections
    const removeTwitchConnection = async () => {
        if (user) {
            const userRef = doc(db, "users", user.uid);

            try {
                await updateDoc(userRef, {
                    "connections.twitch": deleteField(),
                });

                await revokeAccessToken();

                addConnection("twitch", null);

                console.log("Twitch connection removed successfully.");
            } catch (e) {
                console.error("Error removing Twitch connection:", e);
            }
        }
    };

    return (
        <button
            className={cx(styles.button, styles["button--disconnect"])}
            onClick={() => removeTwitchConnection()}
        >
            Disconnect
        </button>
    );
};

export default TwitchDisconnectButton;
