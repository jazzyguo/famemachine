import React from "react";
import styles from "./FileUploader.module.scss";

const VideoContainer = ({ selectedFile }: { selectedFile: File }) => (
    <div className={styles.video_container}>
        <div>
            <h2>File Details:</h2>
            <p>File Name: {selectedFile.name}</p>
            <p>File Type: {selectedFile.type}</p>
        </div>
        <video
            src={selectedFile && URL.createObjectURL(selectedFile)}
            controls
        />
    </div>
);

export default React.memo(VideoContainer);
