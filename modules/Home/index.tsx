import React, { useState } from "react";
import FileUploader from "@/components/FileUploader";
import VideoList from "@/components/VideoList";
import styles from "./Home.module.scss";

const HomeModule = () => {
    const [clips, setClips] = useState<string[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const onFileUpload = async (formData: FormData) => {
        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/process_video",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const clips: { urls: string[] } = await response.json();

            setClips(clips?.urls || []);
        } catch (e: any) {
            console.log(e);
            setError(e);
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <FileUploader onFileUpload={onFileUpload} loading={loading} />
            {error && <div>{error?.message || "An error has occured"}</div>}
            {!loading && !!clips.length && <VideoList clips={clips} />}
        </div>
    );
};
export default HomeModule;
