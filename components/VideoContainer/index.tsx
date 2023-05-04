import React, { ChangeEvent } from "react";
import styles from "./VideoContainer.module.scss";

type Props = {
    selectedFile: File | null;
    disabled: boolean;
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const VideoMemo = React.memo(
    ({ selectedFile }: { selectedFile: File | null }) =>
        selectedFile ? (
            <video src={URL.createObjectURL(selectedFile)} controls />
        ) : null
);

const VideoContainer = ({ selectedFile, disabled, onFileChange }: Props) => (
    <div className={styles.video_container}>
        <div>
            <div className={styles.input}>
                <label htmlFor="file-input">
                    Upload a video file:
                    <input
                        type="file"
                        accept="video/*"
                        onChange={onFileChange}
                    />
                </label>
            </div>
            {selectedFile && (
                <>
                    <h2>File Details:</h2>
                    <p>File Name: {selectedFile.name}</p>
                    <p>File Type: {selectedFile.type}</p>
                    {!disabled && <button type="submit">Process</button>}
                </>
            )}
        </div>
        <VideoMemo selectedFile={selectedFile} />
    </div>
);

export default React.memo(VideoContainer);
