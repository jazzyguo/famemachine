import React from "react";
import { useRouter } from "next/router";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const TwitchConnectButton = () => {
    const router = useRouter();

    const openTwitchAuth = async () => {
        const redirect = `${process.env.NEXT_PUBLIC_BASE_URL}/connect/twitch`;

        const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${publicRuntimeConfig.TWITCH_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=user:edit+user:read:email`;

        router.push(twitchAuthUrl);
    };

    return <button onClick={openTwitchAuth}>Connect Twitch Account</button>;
};

export default TwitchConnectButton;

/**
 *  curl -X GET 'https://api.twitch.tv/helix/videos?user_id=51496027' \
-H 'Authorization: Bearer jh0kdxp0glxwsj4f2me774tnmnrt70' \
-H 'Client-Id: l0122tzvf1hjb89yjoogivk0frglsp'
 */
