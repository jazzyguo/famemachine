import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { useAuth0 } from "@auth0/auth0-react";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

import Loading from "@/components/Loading";

import styles from "./TwitchConnect.module.scss";

type TwitchData = {
    data: {
        display_name: string;
        id: string;
        login: string;
        email: string;
    }[];
};

/**
 * We redirect to this page once the user finishes twitch auth
 * We pull the access token from the query
 * And then proceed to link the twitch account with the logged in user
 */
const TwitchConnectModule = () => {
    const router = useRouter();
    const { code } = router.query;

    const { user, getAccessTokenSilently } = useAuth0();
    const { sub, email_verified } = user || {};

    const fetchTwitchProfile = useCallback(
        async (twitchAccessToken: string) => {
            // call Twitch API to get user's Twitch ID and channel name
            const twitchResponse = await fetch(
                "https://api.twitch.tv/helix/users",
                {
                    headers: {
                        Authorization: `Bearer ${twitchAccessToken}`,
                        "Client-Id": publicRuntimeConfig.TWITCH_CLIENT_ID,
                    },
                }
            );

            if (twitchResponse.status !== 200) {
                throw new Error("Fetching twitch profile failed");
            }

            const twitchData: TwitchData = await twitchResponse.json();

            console.log("twitch profile", twitchData);

            return twitchData;
        },
        []
    );

    // once we have the access token
    // we call the user management api from auth0 to link the current logged in account with twitch
    const linkTwitchAccount = useCallback(
        async (twitchData: TwitchData) => {
            const { id: twitchId, display_name: twitchChannel } =
                twitchData.data[0];

            // get the Auth0 Management API token
            const managementApiToken = await getAccessTokenSilently({
                authorizationParams: {
                    scope: "update:users update:current_user_identities",
                },
            });

            // call Auth0 Management API to link the Twitch account to the current user
            const auth0Response = await fetch(
                `https://${publicRuntimeConfig.AUTH0_DOMAIN}/api/v2/users/${sub}/identities`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${managementApiToken}`,
                    },
                    body: JSON.stringify({
                        provider: "twitch",
                        user_id: twitchId,
                        connection_id: "con_S7o1XPhi2EbNSsBt",
                        isSocial: true,
                        profileData: {
                            channel: twitchChannel,
                        },
                    }),
                }
            );

            if (auth0Response.status !== 200) {
                throw new Error("Failed to communicate with auth0 api");
            }

            const auth0Data = await auth0Response.json();

            console.log("Twitch account linked", auth0Data);
        },
        [sub, getAccessTokenSilently]
    );

    // on redirect from twitch auth window, we parse the code in query
    // to get our twitch access token
    const getAccessToken = useCallback(async () => {
        try {
            const response = await fetch("https://id.twitch.tv/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    grant_type: "authorization_code",
                    client_id: publicRuntimeConfig.TWITCH_CLIENT_ID,
                    client_secret: publicRuntimeConfig.TWITCH_CLIENT_SECRET,
                    code,
                    redirect_uri: `${publicRuntimeConfig.AUTH0_REDIRECT}/connect/twitch`,
                }),
            });

            const data = await response.json();

            if (response.status !== 200 || !data?.access_token) {
                throw new Error("Invalid authorization");
            }

            const twitchData = await fetchTwitchProfile(data.access_token);

            await linkTwitchAccount(twitchData);
        } catch (e) {
            console.log("Twitch link error", e);
        }

        router.push("/");
    }, [code, linkTwitchAccount, router, fetchTwitchProfile]);

    useEffect(() => {
        if (code && email_verified) {
            getAccessToken();
        }
    }, [code, getAccessToken, email_verified, router]);

    return (
        <div className={styles.container}>
            <Loading />
        </div>
    );
};

export default TwitchConnectModule;
