import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import io from "socket.io-client";
import axios from "@/lib/axios";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { ATHENA_API_URL } from "@/lib/consts/api";
import { useAuth } from "@/contexts/AuthContext";

type ProcessTwitchVodDTO = {
    timestamp: [number, number];
    videoId: string;
};

const processTwitchVod = async ({
    timestamp,
    videoId,
}: ProcessTwitchVodDTO): Promise<string> => {
    const response: { message: string } = await axios.post(
        `/twitch/process_vod/${videoId}`,
        {
            start: timestamp[0],
            end: timestamp[1],
        }
    );

    return response.message;
};

type useProcessTwitchVodOptions = {
    config?: MutationConfig<typeof processTwitchVod>;
};

const useProcessTwitchVod = ({ config }: useProcessTwitchVodOptions = {}) => {
    const { user } = useAuth();

    const [clips, setClips] = useState<TempClip[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const userId = user.uid;
        const socket = io(ATHENA_API_URL);

        const socketId = `twitch_vod_processed_${userId}`;

        const handleTwitchVodProcessed = (newTempClips: TempClip[]) => {
            console.log("Received processed Twitch VOD:", newTempClips);
            queryClient.setQueryData<TempClip[] | null>(
                ["temporaryClips"],
                (data) => {
                    if (data) {
                        return [...data, ...newTempClips];
                    }
                }
            );
            setClips(newTempClips);
            setIsLoading(false);
        };

        socket.on(socketId, handleTwitchVodProcessed);

        return () => {
            socket.off(socketId);
        };
    }, [user]);

    return {
        isLoading,
        data: clips,
        mutation: useMutation<string, any, ProcessTwitchVodDTO>({
            onSuccess: () => {
                setIsLoading(true);
            },
            ...config,
            mutationFn: processTwitchVod,
        }),
    };
};

export default useProcessTwitchVod;
