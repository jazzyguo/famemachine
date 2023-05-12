import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import { TwitchPlayer } from "react-twitch-embed";

import GeneratedClipsList from "@/components/GeneratedClipsList";
import VideoSlicerForm from "@/components/VideoSlicerForm";

import { useConnections } from "@/contexts/ConnectionsContext";
import { useTwitchVideosAPI } from "@/contexts/TwitchVideosContext";
import { useAuth } from "@/contexts/AuthContext";

import { TWITCH_API_URL, ATHENA_API_URL } from "@/lib/consts/api";
import { TWITCH_CLIENT_ID } from "@/lib/consts/config";

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

const mock_clips = [
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683862699__frames-214830to216601.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T033943Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=dde5f147084a63121dfd3a3e63fb43dc3cee6e8eb0a42b8ef729bc94274b24c4",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683862699__frames-209970to211770.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T033944Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=2bf515b327d838c48021cc8327b8d75c20fcde5b933cb6aad0d8723174e97028",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683862699__frames-66510to68310.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T033945Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=e88461301d76bcd0a385dda3a0deb666610a950d0ab2f9b3dd45308a0ba60935"
]

const VideoIDModule = () => {
    const router = useRouter();
    const { video_id: videoId } = router.query;

    const { user } = useAuth();
    const { twitch } = useConnections();
    const { refreshAccessToken } = useTwitchVideosAPI();

    const [clips, setClips] = useState<string[]>(mock_clips);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const accessToken = twitch?.access_token;

    const { data: { data } = {} } = useSWRImmutable(
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

    const handleProcess = async (timestamp: [number, number]) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${ATHENA_API_URL}/twitch/process_vod/${videoId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: user.uid,
                        start: timestamp[0],
                        end: timestamp[1],
                    }),
                }
            );

            const clips: { urls: string[] } = await response.json();

            setClips(clips?.urls || []);
        } catch (e: any) {
            console.log(e);
            setError(e);
        }

        setLoading(false);
    };

    const video = data && data[0];

    return (
        <div className={styles.container}>
            {error && !loading && (
                <div className={styles.error}>
                    {error?.message || "An error has occured"}
                </div>
            )}
            {video && (
                <>
                    <div className={styles.videoContainer}>
                        <TwitchPlayer video={video.id} autoplay={false} />
                        <VideoSlicerForm
                            onSubmit={handleProcess}
                            duration={video.duration}
                            loading={loading}
                        />
                    </div>
                    {!loading && !!clips.length && !error && (
                        <div className={styles.clips}>
                            <GeneratedClipsList clips={clips} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default VideoIDModule;
