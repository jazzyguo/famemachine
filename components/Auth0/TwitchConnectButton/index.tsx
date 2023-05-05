import React from "react";
import { useRouter } from "next/router";

import { useAuth0 } from "@auth0/auth0-react";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const TwitchConnectButton = () => {
    const router = useRouter();

    const { user } = useAuth0();
    const { email_verified, email } = user || {};

    const openTwitchAuth = async () => {
        if (!email_verified) {
            throw new Error(
                `Account linking is only allowed to a verified account. Please verify your email first - ${email}.`
            );
        }

        const redirect = `${publicRuntimeConfig.AUTH0_REDIRECT}/connect/twitch`;

        const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${publicRuntimeConfig.TWITCH_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=user:edit+user:read:email`;

        router.push(twitchAuthUrl);
    };

    return <button onClick={openTwitchAuth}>Connect Twitch Account</button>;
};

export default TwitchConnectButton;
