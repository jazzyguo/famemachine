import React, { useEffect, SyntheticEvent } from "react";
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

    const clips = useClipsStore((state) => state.temporaryClips);
    const loading = useClipsStore((state) => state.loading);

    useEffect(() => {
        if (!clips) {
            getTemporaryClips(user.uid);
        }
    }, [clips, getTemporaryClips, user.uid]);

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
                    aria-label="disabled tabs example"
                >
                    <Tab label="Temporary" />
                    <Tab label="Saved" />
                </Tabs>
            </div>
            <h3 className={styles.title}>
                These clips will expire after 24 hours if not saved or
                published.
            </h3>
            <ClipsList clips={clips} header={false} />
        </>
    );
};

export default TemporaryClipsModule;
