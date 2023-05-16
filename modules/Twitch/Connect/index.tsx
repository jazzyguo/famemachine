import React, { useEffect, useCallback, memo } from "react";
import { useRouter } from "next/router";
import addData from "@/firebase/firestore/addData";
import { db } from "@/firebase/config";
import { collectionGroup, where, query, getDocs } from "firebase/firestore";

import { useAuth } from "@/contexts/AuthContext";
import { useConnectionsAPI } from "@/contexts/ConnectionsContext";
import Loading from "@/components/Loading";

import { TWITCH_CLIENT_ID } from "@/lib/consts/config";

type TwitchData = {
    data: {
        display_name: string;
        id: string;
        login: string;
        email: string;
    }[];
};

type Props = {
    accessToken: string;
    refreshToken: string;
};

/**
 * We redirect to this page once the user finishes twitch auth
 * We pull the access token from the query
 * And then proceed to link the twitch account with the logged in user
 */
const TwitchConnectModule = ({ accessToken, refreshToken }: Props) => {
    const { user } = useAuth();
    const { addConnection } = useConnectionsAPI();

    const router = useRouter();

    const fetchTwitchProfile = useCallback(async () => {
        // call Twitch API to get user's Twitch ID and channel name
        const twitchResponse = await fetch(
            "https://api.twitch.tv/helix/users",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Client-Id": TWITCH_CLIENT_ID,
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
        const twitchUserQuery = query(
            collectionGroup(db, "users"),
            where("connections.twitch.user_id", "==", userId)
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
                console.log({ twitchData });
                const twitchUserId = twitchData.data[0].id;
                const channel = twitchData.data[0].display_name;

                await getIsTwitchAccountLinked(twitchUserId);

                const twitchConnection = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    user_id: twitchUserId,
                    channel,
                };

                const { error } = await addData("users", user.uid, {
                    connections: {
                        twitch: twitchConnection,
                    },
                });

                if (error) {
                    throw new Error("Error setting twitch link");
                } else {
                    addConnection("twitch", twitchConnection);
                }
            }
        },
        [user.uid, accessToken, addConnection, refreshToken]
    );

    useEffect(() => {
        const handleAccessToken = async () => {
            try {
                const twitchData = await fetchTwitchProfile();
                await linkTwitchAccount(twitchData);
            } catch (e) {
                console.log(e);
            }
            router.push("/connections");
        };

        if (accessToken) {
            handleAccessToken();
        }
    }, [accessToken, fetchTwitchProfile, linkTwitchAccount, router]);

    return (
        <div style={{ padding: "8rem" }}>
            <Loading />
        </div>
    );
};

export default memo(TwitchConnectModule);
