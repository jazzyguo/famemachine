import React from "react";
import { useRouter } from "next/router";
import { TWITCH_API_URL } from "@/utils/consts/api";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const TwitchConnectButton = () => {
    const router = useRouter();
    
    const openTwitchAuth = () => {
        const redirect = `${process.env.NEXT_PUBLIC_BASE_URL}/connect/twitch`;

        const twitchAuthUrl = `${TWITCH_API_URL}/authorize?client_id=${publicRuntimeConfig.TWITCH_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=user:edit+user:read:email`;

        router.push(twitchAuthUrl);
    };

    return <button onClick={openTwitchAuth}>Connect Twitch Account</button>;
};

export default React.memo(TwitchConnectButton);
