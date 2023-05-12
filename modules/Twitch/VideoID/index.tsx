import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import { TwitchPlayer } from "react-twitch-embed";

import GeneratedClipsList from "@/components/GeneratedClipsList";
import VideoSlicerForm from "@/components/VideoSlicerForm";

import { useConnections } from "@/contexts/ConnectionsContext";
import { useTwitchVideosAPI } from "@/contexts/TwitchVideosContext";
import { useAuth } from "@/contexts/AuthContext";

import { TWITCH_API_URL, ATHENA_API_URL } from "@/utils/consts/api";
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

const mock_clips = [
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip2.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030600Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=8f2fa72c246d3a2544cf878930fbab065aed91f19baebac5f314df283c8e1116",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip1.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030601Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=c0dbfd7503d0ccd0c79413b6d52e54fbb8c38cf0d9290d289cdcd71b09dd2f3b",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip0.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030601Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=a1ed0576c3dd4af085a5477eb71c58c19da4025e1eac21b45ce35b86f8090f07",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip3.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030602Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=d26e2f2a6ceeba822fc088d7bac115b66ca54b9a30379bab8c90f84a3a52cf0c",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip4.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030602Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=f3a6c60b8d11b2190d1ea89f53ab6166083c4ee36d7b3deb5fd46ff85d1906cc",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip6.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030603Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=df38d7aab6772c00943c85ff5cab280a7aed350816cbc0abba8315ef59d8bcbe",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip5.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030603Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=9113f873575863728bf9689040be0f73c84fac2ca22e4813d8c0e59e4dfee9b9",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip7.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030604Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=cb0c961566661a2cdba5824ffec5a2b64fd23af020b98d85d61675d9629d14ee",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip8.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030605Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=63c0fa57599d412af1e821fadc77195bda579e7d55d49b36282e9561528a48b6",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip9.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030605Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=e71a50da888aea57c1df744a1ee38461f99985b3e897045c89b75351b0751ae6",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip11.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030606Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=54f89c4d1db00907b41ff9763763cc4e14ac140efd9962aa339b04084ae54659",
    "https://clips-development.s3.amazonaws.com/QnvqvScscUScEL38dpibUoAIjS03/temp_clips/twitch-1811404908-1683860593_clip10.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3T3F4RKQ6ZYSZ57G%2F20230512%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230512T030606Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=1b6108985c2e30ad11f5ed908f18dde16bd62b37f3e080dd714e9f6eb47674b6",
];

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
