import React from "react";
import styles from "./VideoList.module.scss";

type Props = {
    clips: string[];
};

const VideoList = ({ clips }: Props) => (
    <div className={styles.container}>
        <h2>Generated Clips</h2>
        <div className={styles.video_grid}>
            {clips.map((clip) => (
                <video src={clip} controls />
            ))}
        </div>
    </div>
);

export default VideoList;
