import React, { SyntheticEvent } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";
import Link from "next/link";

import useClipsStore from "@/stores/clips";

import Loading from "@/components/Loading";
import ClipsList from "@/components/Clips/List";

import styles from "./Clips.module.scss";

const TemporaryClipsModule = () => {
    const router = useRouter();

    const clips = useClipsStore((state) => state.temporaryClips);
    const loading = useClipsStore((state) => state.loading);

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
            <ClipsList
                clips={clips}
                HeaderComponent={() => (
                    <>
                        <h3 className={styles.title}>
                            These clips will expire after 24 hours if not saved.
                        </h3>
                        <p className={styles.text}>
                            Save a clip to publish it.
                        </p>
                    </>
                )}
                EmptyComponent={() => (
                    <span>
                        Please generate some clips from your <Link href="/videos">Video Library</Link> to get started.
                    </span>
                )}
            />
        </>
    );
};

export default TemporaryClipsModule;
