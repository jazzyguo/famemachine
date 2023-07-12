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
    videoId?: string;
    config?: MutationConfig<typeof processTwitchVod>;
};

/*
 * Will handle generation of clips that are pushed to generatedClips-videoId query key as they come in from the websocket
 * Generated clips are also pushed to the temporaryClips query key
 */
const useProcessTwitchVod = ({
    videoId,
    config,
}: useProcessTwitchVodOptions = {}) => {
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);

    const userId = user.uid;
    const generatedClipsQueryKey = `generatedClips-${videoId}`;

    /*
     * Socket is open on processing vod start
     * Socket closes once the job is done / on error / on unmount
     */
    const jobSocketId = useMemo(
        () => `twitch_vod_processed_${userId}`,
        [userId]
    );

    const clipSocketId = useMemo(() => `clip_generated_${userId}`, [userId]);

    const disconnectSocket = useCallback(() => {
        if (socket) {
            socket.off(jobSocketId);
            socket.off(clipSocketId);
            socket.disconnect();
        }
    }, [socket, jobSocketId, clipSocketId]);

    // generated clips should reinit on every process start, remount, unmount
    // should potentially change in future when we have an endpoint to fetch generatedClips on twitch vod id
    const setGeneratedClipsToEmpty = () => {
        queryClient.setQueryData<TempClip[] | null>(
            [generatedClipsQueryKey],
            () => []
        );
    };

    useEffect(() => {
        setGeneratedClipsToEmpty();
        return () => setGeneratedClipsToEmpty();
    }, []);

    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, [disconnectSocket]);

    const handleClipGenerated = (clip: TempClip) => {
        console.log("Received generated clip:", clip);

        // add to temporaryClips as well
        queryClient.setQueryData<TempClip[] | null>(
            ["temporaryClips"],
            (data) => {
                if (data) {
                    return [...data, clip];
                }
            }
        );
        queryClient.setQueryData<TempClip[] | null>(
            [generatedClipsQueryKey],
            (data) => {
                if (data) {
                    return [...data, clip];
                } else {
                    return [clip];
                }
            }
        );
    };

    const handleTwitchVodProcessed = useCallback(
        (newSocket: Socket) => {
            console.log("Twitch vod finished processing");
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

    const mutation = useMutation<string, any, ProcessTwitchVodDTO>({
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

            newSocket.on(clipSocketId, handleClipGenerated);

            setGeneratedClipsToEmpty();

            setSocket(newSocket);
            setIsLoading(true);
            return processTwitchVod(payload);
        },
    });

    return {
        isLoading,
        mutation,
    };
};

export default useProcessTwitchVod;
