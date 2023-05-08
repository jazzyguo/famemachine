import React, { useEffect } from "react";
import Link from "next/link";
import { useConnectionsContext } from "@/contexts/ConnectionsContext";

import styles from "./Videos.module.scss";

const TwitchVideos = () => {
    const { twitch } = useConnectionsContext();

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

export default TwitchVideos;
