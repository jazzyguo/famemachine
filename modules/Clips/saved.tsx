import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useClipsStore from "@/stores/clips";

import Loading from "@/components/Loading";

import styles from "./Clips.module.scss";

const SavedClipsModule = () => {
    const { user } = useAuth();

    const getSavedClips = useClipsStore((state) => state.getSavedClips);

    const clips = useClipsStore((state) => state.savedClips);
    const loading = useClipsStore((state) => state.loading);

    useEffect(() => {
        if (!clips.length) {
            getSavedClips(user.uid);
        }
    }, [clips, getSavedClips, user.uid]);

    console.log({ clips });

    return <>{loading && <Loading />}</>;
};

export default SavedClipsModule;
