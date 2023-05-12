import React, { memo, useState } from "react";
import { useInView } from "react-intersection-observer";

import styles from "./VideoContainer.module.scss";

type Props = {
    url: string;
};

const VideoContainer = ({ url }: Props) => {
    const [loaded, setLoaded] = useState(false);
    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const handleLoaded = () => {
        setLoaded(true);
    };

    return (
        <div className={styles.container} ref={ref}>
            <video
                src={loaded || !inView ? url : undefined}
                controls
                onLoadedData={handleLoaded}
            />
        </div>
    );
};

export default memo(VideoContainer);
