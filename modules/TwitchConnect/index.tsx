import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import addData from "@/firebase/firestore/addData";
import firebaseApp from "@/firebase/config";
import {
    getFirestore,
    collectionGroup,
    where,
    query,
    getDocs,
} from "firebase/firestore";

import { useAuthContext } from "@/contexts/AuthContext";
import { useIntegrationsAPIContext } from "@/contexts/IntegrationsContext";
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
const TwitchConnectModule = ({ accessToken }: { accessToken: string }) => {
    const { user } = useAuthContext();
    const addIntegration = useIntegrationsAPIContext();

    const router = useRouter();

    const fetchTwitchProfile = useCallback(async () => {
        // call Twitch API to get user's Twitch ID and channel name
        const twitchResponse = await fetch(
            "https://api.twitch.tv/helix/users",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Client-Id": publicRuntimeConfig.TWITCH_CLIENT_ID,
                },
            }
        );

        if (twitchResponse.status !== 200) {
            throw new Error("Fetching twitch profile failed");
        }

        const twitchData: TwitchData = await twitchResponse.json();

        return twitchData;
    }, [accessToken]);

    const getIsTwitchAccountLinked = async (userId: string) => {
        const db = getFirestore(firebaseApp);

        const twitchUserQuery = query(
            collectionGroup(db, "users"),
            where("integrations.twitch.user_id", "==", userId)
        );

        const snapshot = await getDocs(twitchUserQuery);

        if (!!snapshot?.docs?.length) {
            throw new Error("Twitch account already linked");
        }
    };

    /**
     * Save twitch access token and twitch user id to user in firestore
     */
    const linkTwitchAccount = useCallback(
        async (twitchData: TwitchData) => {
            if (accessToken && twitchData.data?.length) {
                const twitchUserId = twitchData.data[0].id;

                await getIsTwitchAccountLinked(twitchUserId);

                const twitchIntegration = {
                    access_token: accessToken,
                    user_id: twitchUserId,
                };

                const { error } = await addData("users", user.uid, {
                    integrations: {
                        twitch: twitchIntegration,
                    },
                });

                if (error) {
                    throw new Error("Error setting twitch link");
                } else {
                    addIntegration("twitch", twitchIntegration);
                }
            }
        },
        [user.uid, accessToken, addIntegration]
    );

    useEffect(() => {
        const handleAccessToken = async () => {
            try {
                const twitchData = await fetchTwitchProfile();
                await linkTwitchAccount(twitchData);
            } catch (e) {
                console.log(e);
            }
            router.push("/");
        };

        if (accessToken) {
            handleAccessToken();
        }
    }, [accessToken, fetchTwitchProfile, linkTwitchAccount, router]);

    return (
        <div className={styles.container}>
            <Loading />
        </div>
    );
};

export default React.memo(TwitchConnectModule);
