import React, { useState, ChangeEvent, FormEvent } from "react";
import Loading from "@/components/Loading";
import VideoContainer from "./VideoContainer";
import styles from "./FileUploader.module.scss";

const FileUploader = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedFile) {
            setError(null);
            setLoading(true);

            const formData = new FormData();
            formData.append("videoFile", selectedFile);

            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/process_video",
                    {
                        method: "POST",
                        body: formData,
                    }
                );
            } catch (e: any) {
                console.log(e);
                setError(e);
            }

            setLoading(false);
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
            {selectedFile && <VideoContainer selectedFile={selectedFile} />}
            {error && <div>{error?.message || "An error has occured"}</div>}
            {selectedFile &&
                (loading ? (
                    <Loading />
                ) : (
                    <button type="submit" disabled={loading}>
                        Submit
                    </button>
                ))}
        </form>
    );
};

export default React.memo(FileUploader);
