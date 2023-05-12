import React from "react";
import Link from "next/link";
import VideoContainer from "@/components/Clips/VideoContainer";

import styles from "./ClipsList.module.scss";

type Props = {
    clips: string[] | null;
    header?: boolean;
};

const ClipsList = ({ clips, header = true }: Props) => (
    <div className={styles.container}>
        {header && (
            <>
                <h2>Generated Clips</h2>
                <p>
                    These generated clips are also available in your{" "}
                    <Link href="/clips">Clips Library</Link> for 24 hours unless
                    you save them
                </p>
            </>
        )}
        <div className={styles.video_grid}>
            {clips &&
                !!clips.length &&
                clips.map((clip, idx) => (
                    <VideoContainer key={`${clip}-${idx}`} url={clip} />
                ))}
        </div>
    </div>
);

export default ClipsList;
