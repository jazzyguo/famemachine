import React from "react";
import Link from "next/link";

import styles from "./GeneratedClipsList.module.scss";

type Props = {
    clips: string[];
    header?: boolean;
};

const GeneratedClipsList = ({ clips, header = true }: Props) => (
    <div className={styles.container}>
        {header && (
            <>
                <h2>Generated Clips</h2>
                <p>
                    These generated clips are also available in your{" "}
                    <Link href="/clips">Clips Library</Link> for 24 hours unless you save them
                </p>
            </>
        )}
        <div className={styles.video_grid}>
            {clips.map((clip, idx) => (
                <video src={clip} key={`clip-${idx}`} controls />
            ))}
        </div>
    </div>
);

export default GeneratedClipsList;
