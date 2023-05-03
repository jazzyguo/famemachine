import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./FileUploader.module.scss";

const FileUploader = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedFile) {
            const formData = new FormData();
            formData.append("videoFile", selectedFile);

            // fetch("", {
            //     method: "POST",
            //     body: formData,
            // });
        }
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <div className={styles.input_container}>
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
            )}
            {selectedFile && <button type="submit">Submit</button>}
        </form>
    );
};

export default FileUploader;
