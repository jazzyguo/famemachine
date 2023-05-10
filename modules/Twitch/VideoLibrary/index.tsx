import React, { useEffect } from "react";
import Link from "next/link";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useTwitchVideosAPI, useTwitchVideos } from "@/contexts/TwitchVideosContext";

import styles from "./VideoLibrary.module.scss";

const VideoLibrary = () => {
    const { twitch } = useConnections();
    const twitchVideosContext = useTwitchVideosAPI();

    if (!twitch) {
        return (
            <div className={styles.noConnection}>
                <Link href="/connections">Connect</Link> your twitch account to
                retrieve your videos library.
            </div>
        );
    }

    return <div>Videos</div>;
};

export default VideoLibrary;
