import React from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import { TWITCH_API_AUTH_URL } from "@/lib/consts/api";
import { TWITCH_CLIENT_ID } from "@/lib/consts/config";

import styles from "../../../Connections.module.scss";

const TwitchConnectButton = () => {
    const router = useRouter();

    const openTwitchAuth = () => {
        const redirect = `${process.env.NEXT_PUBLIC_BASE_URL}/connect/twitch`;

        const twitchAuthUrl = `${TWITCH_API_AUTH_URL}/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=user:edit+user:read:email`;

        router.push(twitchAuthUrl);
    };

    return (
        <button
            onClick={openTwitchAuth}
            className={cx(styles.button, styles["button--connect"])}
        >
            Connect
        </button>
    );
};

export default TwitchConnectButton;
