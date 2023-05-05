import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import FileUploader from "@/components/FileUploader";
import VideoList from "@/components/VideoList";
import LoginButton from "@/components/Auth0/LoginButton";
import LogoutButton from "@/components/Auth0/LogoutButton";
import TwitchConnectButton from "@/components/Auth0/TwitchConnectButton";

import styles from "./Home.module.scss";

const HomeModule = () => {
    const [clips, setClips] = useState<string[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { isAuthenticated } = useAuth0();

    console.log(useAuth0());

    const onFileUpload = async (formData: FormData) => {
        setLoading(true);
        setError(null);

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
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
            <TwitchConnectButton />
            <FileUploader onFileUpload={onFileUpload} loading={loading} />
            {error && !loading && (
                <div className={styles.error}>
                    {error?.message || "An error has occured"}
                </div>
            )}
            {!loading && !!clips.length && !error && (
                <VideoList clips={clips} />
            )}
        </div>
    );
};

export default HomeModule;
