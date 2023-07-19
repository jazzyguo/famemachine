import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import {
    useConnections,
} from "@/contexts/ConnectionsContext";
import useTwitchVideos from "@/api/twitch/getTwitchVideos";

import InfiniteScroller from "@/components/InfiniteScroller";
import Loading from "@/components/Loading";

import styles from "./VideoLibrary.module.scss";

const VideoLibrary = () => {
    const { twitch = {} } = useConnections();

    const router = useRouter();

    const { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useTwitchVideos()

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
            {!!error &&
                // @ts-ignore
                <div className={styles.error}>{error?.message}</div>
            }
            {isLoading
                ? <Loading className={styles.loading} />
                : (
                    <InfiniteScroller
                        className={styles.videosContainer}
                        fetchData={fetchNextPage}
                        loading={isFetchingNextPage}
                        hasNext={!!hasNextPage}
                    >
                        {!data?.pages.length &&
                            <div className={styles.empty}>
                                Your twitch channel has no vods available
                            </div>
                        }
                        {data?.pages.map(({ videos }) => videos &&
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
                            }))
                        }
                    </InfiniteScroller>
                )}
        </div>
    );
};

export default VideoLibrary;
