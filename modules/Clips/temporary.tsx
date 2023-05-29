import React, { useEffect, SyntheticEvent, useMemo } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";

import { useAuth } from "@/contexts/AuthContext";
import useClipsStore from "@/stores/clips";

import Loading from "@/components/Loading";
import ClipsList from "@/components/Clips/List";

import styles from "./Clips.module.scss";

const TemporaryClipsModule = () => {
    const { user } = useAuth();
    const router = useRouter();

    const getTemporaryClips = useClipsStore((state) => state.getTemporaryClips);
    const getSavedClips = useClipsStore((state) => state.getSavedClips);

    const clips = useClipsStore((state) => state.temporaryClips);
    const loading = useClipsStore((state) => state.loading);
    const savedClips = useClipsStore((state) => state.savedClips);

    useEffect(() => {
        if (!clips) {
            getTemporaryClips(user.uid);
        }
    }, [clips, getTemporaryClips, user.uid]);

    // we fetch saved clips as well when on the temporary clips module so we can
    // see on this page which ones we saved / published
    useEffect(() => {
        if (!savedClips) {
            getSavedClips(user.uid);
        }
    }, [getSavedClips, savedClips, user.uid]);

    const handleTabSwitch = (event: SyntheticEvent, tab: number) => {
        if (tab === 1) {
            router.push("/clips/saved");
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <div className={styles.tabs}>
                <Tabs
                    value={0}
                    onChange={handleTabSwitch}
                >
                    <Tab label="Temporary" />
                    <Tab label="Saved" />
                </Tabs>
            </div>
            <h3 className={styles.title}>
                These clips will expire after 24 hours if not saved or
                published.
            </h3>
            <p className={styles.text}>
                Published clips are automatically saved.
            </p>
            <ClipsList clips={clips} header={false} />
        </>
    );
};

export default TemporaryClipsModule;
