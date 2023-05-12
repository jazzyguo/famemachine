import React, { memo, useState } from "react";
import { ATHENA_API_URL } from "@/utils/consts/api";
import { useAuth } from "@/contexts/AuthContext";
import GeneratedClipsList from "@/components/GeneratedClipsList";
import VideoSlicerForm from "@/components/VideoSlicerForm";

import styles from "./VodProcessor.module.scss";

type Props = {
    videoId: string;
    accessToken: string;
    duration: string;
};

const VodProcessor = ({ videoId, accessToken, duration }: Props) => {
    const { user } = useAuth();
    const [clips, setClips] = useState<string[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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

    return (
        <div className={styles.container}>
            <VideoSlicerForm
                onSubmit={handleProcess}
                duration={duration}
                loading={loading}
            />
            {error && !loading && (
                <div className={styles.error}>
                    {error?.message || "An error has occured"}
                </div>
            )}
            {!loading && !!clips.length && !error && (
                <GeneratedClipsList clips={clips} />
            )}
        </div>
    );
};

export default memo(VodProcessor);
