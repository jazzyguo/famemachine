import React, { useState, useMemo, useEffect, memo } from "react";
import { TwitchPlayer } from "react-twitch-embed";

import ClipsList from "@/components/Clips/List";
import VideoSlicerForm from "@/components/VideoSlicerForm";

import {
    useConnections,
    useConnectionsAPI,
} from "@/contexts/ConnectionsContext";
import { useAuth } from "@/contexts/AuthContext";
import useTwitchStore from "@/stores/twitch";
import useClipsStore from "@/stores/clips";

import styles from "./VideoID.module.scss";

type Props = {
    videoId: string
}

const VideoIDModule = ({ videoId }: Props) => {
    const [clips, setClips] = useState<TempClip[]>([])
    const { user } = useAuth();
    const { twitch = {} } = useConnections();
    const { addConnection } = useConnectionsAPI();

    const loading = useClipsStore(state => state.loading)
    const error = useClipsStore(state => state.error)
    const processTwitchVod = useClipsStore(state => state.processTwitchVod)

    const videos = useTwitchStore((state) => state.videos);
    const fetchTwitchVideo = useTwitchStore((state) => state.fetchTwitchVideo);

    const video = useMemo(
        () =>
            videos &&
            videos.find(({ id, duration }) => duration && id === videoId),
        [videos, videoId]
    );

    useEffect(() => {
        if (!video && twitch.access_token && twitch.refresh_token && user.uid && videoId) {
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
        setClips([])
        const generatedClips = await processTwitchVod({
            timestamp,
            accessToken: user.accessToken || "",
            videoId,
        })
        setClips(generatedClips)
    }

    return (
        <div className={styles.container}>
            {video?.duration && (
                <>
                    <div className={styles.videoContainer}>
                        {error && !loading && (
                            <div className={styles.error}>
                                {error?.message || "An error has occured"}
                            </div>
                        )}
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

export default memo(VideoIDModule);
