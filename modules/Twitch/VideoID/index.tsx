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
import useProcessTwitchVod from "@/api/clips/processTwitchVod";

import styles from "./VideoID.module.scss";

type Props = {
    videoId: string
}

const VideoIDModule = ({ videoId }: Props) => {
    const { user } = useAuth();
    const { twitch = {} } = useConnections();
    const { addConnection } = useConnectionsAPI();


    const { mutate: processTwitchVod, data: clips, error, isLoading } = useProcessTwitchVod()

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
        processTwitchVod({
            timestamp,
            videoId,
        })
    }

    return (
        <div className={styles.container}>
            {video?.duration && (
                <>
                    <div className={styles.videoContainer}>
                        {error && !isLoading && (
                            <div className={styles.error}>
                                {error?.message || "An error has occured"}
                            </div>
                        )}
                        <TwitchPlayer video={video.id} autoplay={false} />
                        <VideoSlicerForm
                            onSubmit={handleProcess}
                            duration={video.duration}
                            loading={isLoading}
                        />
                    </div>
                    {!isLoading && !!clips?.length && !error && (
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
