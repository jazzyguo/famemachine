import React, { SyntheticEvent } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";

import useSavedClips from "@/api/clips/getSavedClips";

import Loading from "@/components/Loading";
import ClipsList from "@/components/Clips/List";

import styles from "./Clips.module.scss";

const SavedClipsModule = () => {
    const router = useRouter();

    const { data: clips, isLoading } = useSavedClips()

    const handleTabSwitch = (event: SyntheticEvent, tab: number) => {
        if (tab === 0) {
            router.push("/clips/temporary");
        }
    };

    if (isLoading) {
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
