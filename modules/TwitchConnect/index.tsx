import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import addData from "@/firebase/firestore/addData";
import { useAuthContext } from "@/contexts/AuthContext";

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
    const { user } = useAuthContext();
    const router = useRouter();
    const { code, error } = router.query;

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

    /**
     * Save twitch access token and twitch user id to user in firestore
     */
    const linkTwitchAccount = useCallback(
        async (twitchData: TwitchData, twitchAccessToken: string) => {
            if (twitchAccessToken && twitchData.data?.length) {
                const twitchUserId = twitchData.data[0].id;
                const { error } = await addData("users", user.uid, {
                    email: user.email,
                    twitch_access_token: twitchAccessToken,
                    twitch_user_id: twitchUserId,
                });

                if (error) {
                    throw new Error("Error setting twitch link");
                }
            }
        },
        [user.uid, user.email]
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
                    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/connect/twitch`,
                }),
            });

            const data = await response.json();

            if (response.status !== 200 || !data?.access_token) {
                throw new Error("Invalid authorization");
            }

            const twitchData = await fetchTwitchProfile(data.access_token);

            await linkTwitchAccount(twitchData, data.access_token);
        } catch (e) {
            console.log("Twitch link error", e);
        }

        router.push("/");
    }, [code, linkTwitchAccount, router, fetchTwitchProfile]);

    useEffect(() => {
        if (error || !user) {
            router.push("/");
        }
    }, [error, router, user]);

    useEffect(() => {
        if (code) {
            getAccessToken();
        }
    }, [code, getAccessToken, router]);

    return (
        <div className={styles.container}>
            <Loading />
        </div>
    );
};

export default TwitchConnectModule;
