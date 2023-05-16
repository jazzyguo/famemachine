import React, { useState } from "react";

import FileUploader from "@/components/FileUploader";
import ClipsList from "@/components/Clips/List";
import { useAuth } from "@/contexts/AuthContext";

import { ATHENA_API_URL } from "@/lib/consts/api";

import styles from "./FileUploadProcessor.module.scss";

const FileUploadProcessorModule = () => {
    const [clips, setClips] = useState<string[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();

    const onFileUpload = async (formData: FormData) => {
        setLoading(true);
        setError(null);

        formData.append("user_id", user.uid);

        try {
            const response = await fetch(`${ATHENA_API_URL}/process_file`, {
                method: "POST",
                body: formData,
            });

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
            {error && !loading && (
                <div className={styles.error}>
                    {error?.message || "An error has occured"}
                </div>
            )}
            {!loading && !!clips.length && !error && (
                <ClipsList clips={clips} />
            )}
        </div>
    );
};

export default FileUploadProcessorModule;
