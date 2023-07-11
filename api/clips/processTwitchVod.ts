import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import io from "socket.io-client";
import axios from "@/lib/axios";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { ATHENA_API_URL } from "@/lib/consts/api";

const socket = io(ATHENA_API_URL);

type ProcessTwitchVodDTO = {
    timestamp: [number, number];
    videoId: string;
};

const processTwitchVod = async ({
    timestamp,
    videoId,
}: ProcessTwitchVodDTO): Promise<TempClip[]> => {
    const response: { clips: TempClip[] } = await axios.post(
        `/twitch/process_vod/${videoId}`,
        {
            start: timestamp[0],
            end: timestamp[1],
        }
    );
    return response.clips;
};

type useProcessTwitchVodOptions = {
    config?: MutationConfig<typeof processTwitchVod>;
};

const useProcessTwitchVod = ({ config }: useProcessTwitchVodOptions = {}) => {
    useEffect(() => {
        // Listen for the 'twitch_vod_processed' event from the WebSocket server
        socket.on("twitch_vod_processed", (response_data) => {
            // Handle the received data
            // You can update the state or perform any necessary actions based on the data
            console.log("Received processed Twitch VOD:", response_data);
        });

        return () => {
            // Clean up the WebSocket connection when the component unmounts
            socket.off("twitch_vod_processed");
        };
    }, []);

    return useMutation<TempClip[], any, ProcessTwitchVodDTO>({
        onSuccess: (newTempClips) => {
            // Update temporary clips data by pushing the new generated clips if not existing
            queryClient.setQueryData<TempClip[] | null>(
                ["temporaryClips"],
                (data) => {
                    if (data) {
                        return [...data, ...newTempClips];
                    }
                }
            );
        },
        ...config,
        mutationFn: processTwitchVod,
    });
};

export default useProcessTwitchVod;
