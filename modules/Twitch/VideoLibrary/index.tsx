import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import {
    useConnections,
    useConnectionsAPI,
} from "@/contexts/ConnectionsContext";
import useTwitchStore from "@/stores/twitch";
import { useAuth } from "@/contexts/AuthContext";
import InfiniteScroller from "@/components/InfiniteScroller";
import Loading from "@/components/Loading";

import styles from "./VideoLibrary.module.scss";

const VideoLibrary = () => {
    const { twitch = {} } = useConnections();
    const { addConnection } = useConnectionsAPI();

    const { user } = useAuth();
    const router = useRouter();

    const videos = useTwitchStore((state) => state.videos);
    const error = useTwitchStore((state) => state.error);
    const loading = useTwitchStore((state) => state.loading);
    const cursor = useTwitchStore(state => state.pagination.cursor)

    const fetchTwitchVideos = useTwitchStore(
        (state) => state.fetchTwitchVideos
    );

    const handleFetchTwitchVideos = useCallback(
        async () => {
            if (twitch.user_id && twitch.access_token && twitch.refresh_token) {
                await fetchTwitchVideos({
                    twitchUserId: twitch.user_id,
                    twitchAccessToken: twitch.access_token,
                    addConnection,
                    userId: user.uid,
                    refreshToken: twitch.refresh_token,
                });
            }
        },
        [
            addConnection,
            fetchTwitchVideos,
            twitch.access_token,
            twitch.refresh_token,
            twitch.user_id,
            user.uid,
        ]
    );

    useEffect(() => {
        if (!videos && twitch.user_id && user.uid) {
            handleFetchTwitchVideos();
        }
    }, [
        twitch.user_id,
        fetchTwitchVideos,
        handleFetchTwitchVideos,
        user.uid,
        videos,
    ]);

    if (!twitch.user_id) {
        return (
            <div className={styles.noConnection}>
                <Link href="/connections">Connect</Link> your twitch account to
                retrieve your videos library.
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2>Twitch Videos</h2>
            {error && <div>{error.message}</div>}
            {!videos
                ? <Loading className={styles.loading} />
                : (
                    <InfiniteScroller
                        className={styles.videosContainer}
                        fetchData={handleFetchTwitchVideos}
                        loading={loading}
                        hasNext={!!cursor}
                    >
                        {videos &&
                            !!videos.length &&
                            videos.map((video, idx) => {
                                if (!video.id) return null;

                                const width = "400";
                                const height = "225";
                                const newUrl = (video?.thumbnail_url || "")
                                    .replace(/%{width}/g, width)
                                    .replace(/%{height}/g, height);

                                const is404 =
                                    video.thumbnail_url ===
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
                    </InfiniteScroller>
                )}
        </div>
    );
};

export default VideoLibrary;
