import React, { memo, useMemo, useState } from "react";
import Nouislider from "nouislider-react";
import { debounce } from "lodash";
import Loading from "@/components/Loading";

import "nouislider/distribute/nouislider.css";

import styles from "./VideoSlicerForm.module.scss";

type Props = {
    onSubmit: (timestamp: [number, number]) => void;
    duration: string;
    text?: string;
    loading: boolean;
};

const secondsToStringFormat = (value: number) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = parseInt((value % 60).toString().substring(0, 2));

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const VideoSlicerForm = ({
    onSubmit,
    duration,
    text = "Process",
    loading,
}: Props) => {
    const [timestamp, setTimestamp] = useState<[number, number]>([0, 3600]);

    // duration comes in as xxhxxmxxs
    // sometimes h or m is missing
    const timeString = duration;

    const timeParts = useMemo(() => {
        const result: string[] = timeString.split(/[hms]/).filter(Boolean);
        // fill gaps in missing h or m
        if (result.length < 3) {
            const toFill = 3 - result.length
            for (let i = 0; i < toFill; i++) {
                result.unshift('0')
            }
        }
        return result
    }, [timeString])

    const [hours, minutes, seconds] = timeParts.map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const handleSubmit = () => {
        onSubmit(timestamp);
    };

    const onChangeSlide = (ts: [string, string]) => {
        const [s, e] = ts;
        setTimestamp([parseInt(s), parseInt(e)]);
    };

    const debouncedChangeSlide = debounce(onChangeSlide, 300);

    const [start, end] = timestamp;

    return (
        <div className={styles.container}>
            <div className={styles.slider}>
                {/* @ts-ignore */}
                <Nouislider
                    disabled={loading}
                    range={{ min: 0, max: totalSeconds }}
                    start={timestamp}
                    connect
                    limit={3600}
                    behaviour="drag"
                    step={1}
                    tooltips={[
                        {
                            to: secondsToStringFormat,
                        },
                        {
                            to: secondsToStringFormat,
                        },
                    ]}
                    onSlide={debouncedChangeSlide}
                />
            </div>
            <div className={styles.timestamp}>
                <span>{secondsToStringFormat(start)}</span>-
                <span>{secondsToStringFormat(end)}</span>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <p>Analyzing video and generating clips, please do not refresh the page...</p>
                    <Loading />
                </div>
            ) : (
                <div className={styles.submit} onClick={handleSubmit}>
                    {text}
                </div>
            )}
        </div>
    );
};

export default memo(VideoSlicerForm);
