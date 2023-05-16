import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { TwitchPlayer } from "react-twitch-embed";

import ClipsList from "@/components/Clips/List";
import VideoSlicerForm from "@/components/VideoSlicerForm";

import {
    useConnections,
    useConnectionsAPI,
} from "@/contexts/ConnectionsContext";
import { useAuth } from "@/contexts/AuthContext";
import useTwitchStore from "@/stores/twitch";

import { ATHENA_API_URL } from "@/lib/consts/api";

import styles from "./VideoID.module.scss";

const VideoIDModule = () => {
    const router = useRouter();
    const { video_id: videoId } = router.query;

    const { user } = useAuth();
    const { twitch = {} } = useConnections();
    const { addConnection } = useConnectionsAPI();

    const [clips, setClips] = useState<TempClip[]>();
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const accessToken = twitch?.access_token;

    const videos = useTwitchStore((state) => state.videos);
    const fetchTwitchVideo = useTwitchStore((state) => state.fetchTwitchVideo);

    const video = useMemo(
        () =>
            videos &&
            videos.find(({ id, duration }) => duration && id === videoId),
        [videos, videoId]
    );

    useEffect(() => {
        if (!video && twitch.access_token && user.uid) {
            fetchTwitchVideo({
                twitchAccessToken: twitch.access_token,
                videoId,
                addConnection,
                userId: user.uid,
                refreshToken: twitch.refresh_token,
            });
        }
    }, [
        video,
        twitch.access_token,
        user.uid,
        twitch.refresh_token,
        fetchTwitchVideo,
        videoId,
        addConnection,
    ]);

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

            if (response.status === 200) {
                const data: { clips: TempClip[] } = await response.json();

                setClips(data.clips || []);
            } else {
                throw new Error("Error fetching clips");
            }
        } catch (e: any) {
            console.log(e);
            setError(e);
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            {error && !loading && (
                <div className={styles.error}>
                    {error?.message || "An error has occured"}
                </div>
            )}
            {video?.duration && (
                <>
                    <div className={styles.videoContainer}>
                        <TwitchPlayer video={video.id} autoplay={false} />
                        <VideoSlicerForm
                            onSubmit={handleProcess}
                            duration={video.duration}
                            loading={loading}
                        />
                    </div>
                    {!loading && !!clips?.length && !error && (
                        <div className={styles.clips}>
                            <ClipsList clips={clips} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default VideoIDModule;
