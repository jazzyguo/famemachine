import React, { memo } from "react";
import { useQuery } from '@tanstack/react-query';
import { TwitchPlayer } from "react-twitch-embed";

import ClipsList from "@/components/Clips/List";
import VideoSlicerForm from "@/components/VideoSlicerForm";
import Loading from "@/components/Loading";

import useProcessTwitchVod from "@/api/clips/processTwitchVod";
import useTwitchVideo from "@/api/twitch/getTwitchVideo";

import styles from "./VideoID.module.scss";

type Props = {
    videoId: string
}

const VideoIDModule = ({ videoId }: Props) => {
    const {
        mutation: {
            mutate: processTwitchVod,
            error,
        },
        isProcessing,
    } = useProcessTwitchVod(({ videoId }))

    const { data: clips } = useQuery<TempClip[]>([`generatedClips-${videoId}`]);

    const { data: video, isLoading } = useTwitchVideo({ videoId })

    const handleProcess = async (timestamp: [number, number]) => {
        processTwitchVod({
            timestamp,
            videoId,
        })
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className={styles.container}>
            {video?.duration && (
                <>
                    <div className={styles.videoContainer}>
                        {error && !isProcessing && (
                            <div className={styles.error}>
                                {error?.message || "An error has occured"}
                            </div>
                        )}
                        <TwitchPlayer video={video.id} autoplay={false} />
                        <VideoSlicerForm
                            onSubmit={handleProcess}
                            duration={video.duration}
                            loading={isProcessing}
                        />
                    </div>
                    {!!clips?.length && !error && (
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
