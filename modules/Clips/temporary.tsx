import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useClipsStore from "@/stores/clips";

import Loading from "@/components/Loading";

import styles from "./Clips.module.scss";

const TemporaryClipsModule = () => {
    const { user } = useAuth();

    const getTemporaryClips = useClipsStore((state) => state.getTemporaryClips);

    const clips = useClipsStore((state) => state.temporaryClips);
    const loading = useClipsStore((state) => state.loading);

    useEffect(() => {
        getTemporaryClips(user.uid);
    }, [getTemporaryClips, user.uid]);

    console.log({ clips });

    return <div className={styles.container}>{loading && <Loading />}</div>;
};

export default TemporaryClipsModule;
