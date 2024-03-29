import React, { useState } from "react";

import FileUploader from "@/components/FileUploader";
import ClipsList from "@/components/Clips/List";
import { useAuth } from "@/contexts/AuthContext";

import { ATHENA_API_URL } from "@/lib/consts/api";

import styles from "./FileUploadProcessor.module.scss";

const FileUploadProcessorModule = () => {
    const [clips, setClips] = useState<TempClip[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();

    const onFileUpload = async (formData: FormData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${ATHENA_API_URL}/process_file`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
                body: formData,
            });

            const { clips }: { clips: TempClip[] } = await response.json();

            setClips(clips);
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
