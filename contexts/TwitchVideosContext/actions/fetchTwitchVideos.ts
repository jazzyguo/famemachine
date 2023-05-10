import { Dispatch } from "react";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { TWITCH_API_URL } from "@/utils/consts/api";

import { Action } from "../types";

type Props = {
    cursor: string | null;
    accessToken: string;
    userId: string;
    refreshAccessToken: () => Promise<{
        access_token?: string;
        refresh_token?: string;
    }>;
    dispatch: Dispatch<Action>;
    paginateTo?: "before" | "after";
};

const fetchVideos = async ({
    accessToken,
    userId,
    refreshAccessToken,
    cursor,
    paginateTo,
}: {
    accessToken: Props["accessToken"];
    userId: Props["userId"];
    refreshAccessToken: Props["refreshAccessToken"];
    cursor: Props["cursor"];
    paginateTo: Props["paginateTo"];
}) => {
    let url = `${TWITCH_API_URL}/videos?user_id=51496027&first=10`; //`${TWITCH_API_URL}/videos?user_id=${userId}`,

    if (cursor && paginateTo) {
        url += `&${paginateTo}=${cursor}`;
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Client-Id": publicRuntimeConfig.TWITCH_CLIENT_ID,
        },
    });

    if (response.status === 401) {
        // access token has expired, refresh it and retry the fetch call
        const { access_token: refreshedAccessToken } =
            await refreshAccessToken();

        if (refreshedAccessToken) {
            const refreshedResponse = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${refreshedAccessToken}`,
                    "Client-Id": publicRuntimeConfig.TWITCH_CLIENT_ID,
                },
            });

            return refreshedResponse.json();
        } else {
            throw new Error("Error refreshing access token on fetchVideos");
        }
    } else {
        return response.json();
    }
};

const fetchTwitchVideos = async ({
    cursor,
    accessToken,
    userId,
    refreshAccessToken,
    dispatch,
    paginateTo,
}: Props) => {
    if (accessToken) {
        dispatch({ type: "FETCH_VIDEOS_REQUEST" });

        try {
            const { data, pagination } = await fetchVideos({
                accessToken,
                userId,
                refreshAccessToken,
                cursor,
                paginateTo,
            });

            const videos = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                thumbnail: item.thumbnail_url,
                url: item.url,
                createdAt: item.created_at,
            }));

            dispatch({
                type: "FETCH_VIDEOS_SUCCESS",
                payload: { videos, pagination },
            });
        } catch (error: any) {
            dispatch({
                type: "FETCH_VIDEOS_FAILURE",
                payload: { error: error.message },
            });
        }
    }
};

export default fetchTwitchVideos;
