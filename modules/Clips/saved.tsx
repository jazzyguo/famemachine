import React, { SyntheticEvent } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";

import useClipsStore from "@/stores/clips";

import Loading from "@/components/Loading";
import ClipsList from "@/components/Clips/List";

import styles from "./Clips.module.scss";

const SavedClipsModule = () => {
    const router = useRouter();

    const clips = useClipsStore((state) => state.savedClips);
    const loading = useClipsStore((state) => state.loading);

    const handleTabSwitch = (event: SyntheticEvent, tab: number) => {
        if (tab === 0) {
            router.push("/clips/temporary");
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <div className={styles.tabs}>
                <Tabs
                    value={1}
                    onChange={handleTabSwitch}
                >
                    <Tab label="Temporary" />
                    <Tab label="Saved" />
                </Tabs>
            </div>

            <ClipsList
                clips={clips}
                HeaderComponent={() => (
                    <>
                        <h3 className={styles.title}>
                            Unsaved clips will become temporary for another 24 hours.
                        </h3>
                        <p className={styles.text}>
                            Select a clip to publish it.
                        </p>
                    </>
                )}
            />
        </>
    );
};

export default SavedClipsModule;
