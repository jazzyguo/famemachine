import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { TwitchPlayer } from "react-twitch-embed";

import { useConnections } from "@/contexts/ConnectionsContext";
import { useTwitchVideosAPI } from "@/contexts/TwitchVideosContext";

import { TWITCH_API_URL } from "@/utils/consts/api";
import { TWITCH_CLIENT_ID } from "@/utils/consts/config";

import styles from "./VideoID.module.scss";

const fetchVideoData = async (
    url: string,
    token: string,
    refreshAccessToken: () => Promise<{
        access_token?: string;
    }>
) => {
    const headers = {
        Authorization: `Bearer ${token}`,
        "Client-Id": TWITCH_CLIENT_ID,
    };
    try {
        const res = await fetch(url, { headers });
        if (res.status === 401) {
            const { access_token: refreshedAccessToken } =
                await refreshAccessToken();
            headers.Authorization = `Bearer ${refreshedAccessToken}`;
            const res = await fetch(url, { headers });
            const data = await res.json();
            return data;
        } else {
            const data = await res.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const VideoIDModule = () => {
    const router = useRouter();
    const { video_id: videoId } = router.query;

    const { twitch } = useConnections();

    const accessToken = twitch?.access_token;

    const { refreshAccessToken } = useTwitchVideosAPI();

    const { data: { data } = {}, error } = useSWR(
        accessToken
            ? [
                  `${TWITCH_API_URL}/videos/?id=${videoId}`,
                  accessToken,
                  refreshAccessToken,
              ]
            : null,
        ([url, token, refreshAccessToken]) =>
            fetchVideoData(url, token, refreshAccessToken)
    );

    const video = data && data[0];

    console.log({ video });

    return (
        <div className={styles.videoContainer}>
            {error && <div>{error}</div>}
            {/* <TwitchPlayerNonInteractive
                                video={video.id}
                                muted
                                autoplay={false}
                            /> */}
        </div>
    );
};

export default VideoIDModule;
