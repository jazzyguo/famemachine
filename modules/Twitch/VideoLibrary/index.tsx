import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useConnections } from "@/contexts/ConnectionsContext";
import {
    useTwitchVideosAPI,
    useTwitchVideos,
} from "@/contexts/TwitchVideosContext";

import styles from "./VideoLibrary.module.scss";
import { useRouter } from "next/router";

const VideoLibrary = () => {
    const { twitch } = useConnections();
    const { fetchTwitchVideos } = useTwitchVideosAPI();
    const router = useRouter();

    const { pagination, videos, error, loading } = useTwitchVideos();

    useEffect(() => {
        if (!videos.length) {
            fetchTwitchVideos();
        }
    }, [fetchTwitchVideos, videos]);

    if (!twitch) {
        return (
            <div className={styles.noConnection}>
                <Link href="/connections">Connect</Link> your twitch account to
                retrieve your videos library.
            </div>
        );
    }

    const isFirstPage = !pagination.cursor;

    return (
        <div className={styles.container}>
            <h2>Twitch Videos</h2>
            {error && <div>{error}</div>}
            <div className={styles.videosContainer}>
                {!!videos.length &&
                    videos.map((video, idx) => {
                        const width = "400";
                        const height = "225";
                        const newUrl = (video?.thumbnail || "")
                            .replace(/%{width}/g, width)
                            .replace(/%{height}/g, height);

                        const is404 =
                            video.thumbnail ===
                            "https://vod-secure.twitch.tv/_404/404_processing_%{width}x%{height}.png";

                        const placeholder = `https://dummyimage.com/${width}x${height}/000000/ffffff.png`;

                        return (
                            <div
                                key={`${video.title}-${idx}`}
                                className={styles.videoItem}
                                title={video.title}
                                onClick={() =>
                                    router.push(`/videos/twitch/${video.id}`)
                                }
                            >
                                <span>{video.title}</span>
                                <Image
                                    src={is404 ? placeholder : newUrl}
                                    alt={video.title}
                                    width={width}
                                    height={height}
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default VideoLibrary;
