import React, { ComponentType } from "react";
import Link from "next/link";
import VideoContainer from "@/components/Clips/VideoContainer";

import styles from "./ClipsList.module.scss";

type Props = {
    clips: (SavedClip | TempClip)[] | undefined;
    HeaderComponent?: ComponentType;
    EmptyComponent?: ComponentType;
};

const ClipsList = ({
    clips,
    HeaderComponent = () => (
        <>
            <h2>Generated Clips</h2>
            <p>
                These generated clips are also available in your{" "}
                <Link href="/clips">Clips Library</Link> for 24 hours unless
                you save them. Save a clip to be able to publish it.
            </p>
        </>
    ),
    EmptyComponent = () => <span>There are no available clips.</span>,
}: Props) => (
    <div className={styles.container}>
        {clips &&
            !!clips.length
            ? (
                <>
                    <HeaderComponent />
                    <div className={styles.video_grid}>
                        {clips.map((clip, idx) => (
                            <VideoContainer
                                key={`${clip}-${idx}`}
                                url={clip.url}
                                fileKey={clip.key}
                                published={
                                    "published" in clip ? (clip as SavedClip).published : undefined
                                }
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className={styles.empty}>
                    <EmptyComponent />
                </div>
            )}
    </div>
);

export default ClipsList;
