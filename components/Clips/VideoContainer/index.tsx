import React, { memo, useState, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/router";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import usePublishStore from "@/stores/publish";
import useSavedClips from "@/api/clips/getSavedClips";
import useSaveClip from "@/api/clips/saveClip";
import useUnsaveClip from "@/api/clips/unsaveClip"

import Loading from "@/components/Loading";

import styles from "./VideoContainer.module.scss";

type Props = {
    url: string;
    fileKey: string;
    published: Published | undefined;
};

const VideoContainer = ({ url, fileKey, published }: Props) => {
    const [loaded, setLoaded] = useState<boolean>(false);

    const router = useRouter();

    const isSavedRoute = router.pathname === "/clips/saved";

    const { data: savedClips } = useSavedClips()
    const { mutate: saveClip, isLoading: saveLoading } = useSaveClip()
    const { mutate: unsaveClip, isLoading: unsaveLoading } = useUnsaveClip()

    const openPublishModalWithClip = usePublishStore(state => state.openPublishModalWithClip)

    // check if the fileKey is also in the savedClips state, should also not calculate if already in saved url
    const isSaved: boolean = useMemo(() => {
        if (isSavedRoute) {
            return true;
        } else {
            const existsInSaved = (savedClips || []).find(({ key }) =>
                key === fileKey
            )
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
        await saveClip({
            s3Key: fileKey,
        });
    };

    const handleUnsave = async () => {
        await unsaveClip({
            s3Key: fileKey,
        });
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
                    {(saveLoading || unsaveLoading) ? (
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
                {isSaved &&
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
