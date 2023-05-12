import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useClipsStore from "@/stores/clips";

import Loading from "@/components/Loading";
import ClipsList from "@/components/Clips/List";

import styles from "./Clips.module.scss";

const TemporaryClipsModule = () => {
    const { user } = useAuth();

    const getTemporaryClips = useClipsStore((state) => state.getTemporaryClips);

    const clips = useClipsStore((state) => state.temporaryClips);
    const loading = useClipsStore((state) => state.loading);

    useEffect(() => {
        if (!clips.length) {
            getTemporaryClips(user.uid);
        }
    }, [clips, getTemporaryClips, user.uid]);

    return (
        <>
            {loading && <Loading />}
            <h3 className={styles.title}>
                These clips will expire after 24 hours if not saved or
                published.
            </h3>
            <ClipsList clips={clips} header={false} />
        </>
    );
};

export default TemporaryClipsModule;
