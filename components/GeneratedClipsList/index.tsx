import React from "react";
import styles from "./GeneratedClipsList.module.scss";

type Props = {
    clips: string[];
};

const GeneratedClipsList = ({ clips }: Props) => (
    <div className={styles.container}>
        <h2>Generated Clips</h2>
        <div className={styles.video_grid}>
            {clips.map((clip, idx) => (
                <video src={clip} key={`clip-${idx}`} controls />
            ))}
        </div>
    </div>
);

export default GeneratedClipsList;
