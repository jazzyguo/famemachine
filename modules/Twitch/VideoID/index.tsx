import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useConnections } from "@/contexts/ConnectionsContext";
import {
    useTwitchVideosAPI,
    useTwitchVideos,
} from "@/contexts/TwitchVideosContext";
import { TwitchPlayerNonInteractive } from "react-twitch-embed";

import styles from "./VideoID.module.scss";

const VideoID = () => {
    return (
        <div className={styles.videoContainer}>
            {/* <TwitchPlayerNonInteractive
                                video={video.id}
                                muted
                                autoplay={false}
                            /> */}
        </div>
    );
};

export default VideoID;
