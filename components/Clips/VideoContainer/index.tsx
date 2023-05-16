import React, { memo, useState } from "react";
import { useInView } from "react-intersection-observer";
import useClipsStore from "@/stores/clips";
import { useAuth } from "@/contexts/AuthContext";

import styles from "./VideoContainer.module.scss";

type Props = {
    url: string;
    fileKey: string;
};

const VideoContainer = ({ url, fileKey }: Props) => {
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    const { user } = useAuth();
    const saveClip = useClipsStore((state) => state.saveClip);

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const handleLoaded = () => {
        setLoaded(true);
    };

    const handleSave = () => {
        console.log({ url, fileKey });
        saveClip({ userId: user.uid, s3Key: fileKey });
    };

    const handlePublish = () => {};

    const isSaved = false; // check if the fileKey is also in the savedClips state

    return (
        <div className={styles.container} ref={ref}>
            <div className={styles.videoMenu}>
                <div onClick={handleSave} className={styles.save}>
                    Save
                </div>
            </div>
            <video
                src={loaded || !inView ? url : undefined}
                controls
                onLoadedData={handleLoaded}
            />
        </div>
    );
};

export default memo(VideoContainer);
