import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
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
    const [socket, setSocket] = useState<Socket | null>(null);

    const userId = user.uid;

    /*
     * Socket is open on processing vod start
     * Socket closes once the job is done / on error / on unmount
     */
    const jobSocketId = useMemo(
        () => `twitch_vod_processed_${userId}`,
        [userId]
    );
    
    const clipSocketId = useMemo(
        () => `twitch_vod_clip_generated_${userId}`,
        [userId]
    );

    const disconnectSocket = useCallback(() => {
        if (socket) {
            socket.disconnect();
            socket.off(jobSocketId);
            socket.off(clipSocketId);
        }
    }, [socket, jobSocketId, clipSocketId]);

    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, [disconnectSocket]);

    const handleClipGenerated = (clip: TempClip) => {
        console.log("Received generated clip:", clip);
        queryClient.setQueryData<TempClip[] | null>(
            ["temporaryClips"],
            (data) => {
                if (data) {
                    return [...data, clip];
                }
            }
        );
        setClips([...clips, clip]);
    };

    const handleTwitchVodProcessed = useCallback(
        (newSocket: Socket) => {
            console.log("Twitch vod finished processing:");
            setIsLoading(false);
            if (newSocket) {
                newSocket.off(jobSocketId);
                newSocket.off(clipSocketId);
                newSocket.disconnect();
                setSocket(null);
            }
        },
        [jobSocketId, clipSocketId]
    );

    return {
        isLoading,
        data: clips,
        mutation: useMutation<string, any, ProcessTwitchVodDTO>({
            ...config,
            onError: () => {
                setIsLoading(false);
                disconnectSocket();
            },
            mutationFn: (payload) => {
                const newSocket = io(ATHENA_API_URL);

                newSocket.on(jobSocketId, () =>
                    handleTwitchVodProcessed(newSocket)
                );

                newSocket.on(clipSocketId, (clip) => handleClipGenerated(clip));

                setSocket(newSocket);
                setIsLoading(true);
                return processTwitchVod(payload);
            },
        }),
    };
};

export default useProcessTwitchVod;
