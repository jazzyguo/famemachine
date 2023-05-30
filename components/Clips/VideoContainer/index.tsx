import React, { memo, useState, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/router";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import useClipsStore from "@/stores/clips";
import { useAuth } from "@/contexts/AuthContext";
import usePublishStore from "@/stores/publish";

import Loading from "@/components/Loading";

import styles from "./VideoContainer.module.scss";

type Props = {
    url: string;
    fileKey: string;
    published: Published | undefined;
};

const VideoContainer = ({ url, fileKey, published }: Props) => {
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    const router = useRouter();

    const { user } = useAuth();

    const isSavedRoute = router.pathname === "/clips/saved";

    const savedClips = useClipsStore((state) => state.savedClips);
    const saveClip = useClipsStore((state) => state.saveClip);
    const unsaveClip = useClipsStore((state) => state.unsaveClip);

    const openPublishModalWithClip = usePublishStore(state => state.openPublishModalWithClip)

    // check if the fileKey is also in the savedClips state, should also not calculate if already in saved url
    const isSaved: boolean = useMemo(() => {
        if (isSavedRoute) {
            return true;
        } else {
            const existsInSaved = (savedClips || []).find((savedClip) => {
                const getFileName = (clipKey: string) => clipKey.split("/")[2];
                return getFileName(savedClip.key) === getFileName(fileKey);
            });
            return !!existsInSaved;
        }
    }, [fileKey, isSavedRoute, savedClips]);

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const handleLoaded = () => {
        setLoaded(true);
    };

    const handleSave = async () => {
        setSaveLoading(true);
        await saveClip({ userId: user.uid, s3Key: fileKey });
        setSaveLoading(false);
    };

    const handleUnsave = async () => {
        setSaveLoading(true);
        const savedFileKey = isSavedRoute
            ? fileKey
            : `${fileKey}`.replace("temp_clips", "saved_clips");
        await unsaveClip({ userId: user.uid, s3Key: savedFileKey });
        setSaveLoading(false);
    };

    const handlePublish = () => {
        openPublishModalWithClip({
            url,
            key: fileKey,
            published,
        })
    };

    return (
        <div className={styles.container} ref={ref}>
            <div className={styles.videoMenu}>
                <div className={styles.save}>
                    {saveLoading ? (
                        <Loading className={styles.loading} />
                    ) : isSaved ? (
                        <div className={styles.saved} onClick={handleUnsave}>
                            <CheckBoxIcon />
                            <span>Saved</span>
                        </div>
                    ) : (
                        <span onClick={handleSave}>Save</span>
                    )}
                </div>
                {isSavedRoute &&
                    <div className={styles.publish} onClick={handlePublish}>Publish</div>

                }
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
