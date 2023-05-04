import React from "react";
import styles from "./VideoList.module.scss";

type Props = {
    clips: string[];
};

const VideoList = ({ clips }: Props) => (
    <div className={styles.container}>
        {clips.map((clip) => (
            <video src={clip} controls />
        ))}
    </div>
);

export default VideoList;
