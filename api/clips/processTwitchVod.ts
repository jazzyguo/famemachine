import { useMutation } from '@tanstack/react-query';

import axios from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';

type ProcessTwitchVodDTO = {
    timestamp: [number, number];
    videoId: string
};

const processTwitchVod = async ({ timestamp, videoId }: ProcessTwitchVodDTO): Promise<TempClip[]> => {
    const response = await axios.post(`/twitch/process_vod/${videoId}`, {
        start: timestamp[0],
        end: timestamp[1],
    });
    return response.data.clips
};

type useProcessTwitchVodOptions = {
    config?: MutationConfig<typeof processTwitchVod>;
};

const useProcessTwitchVod = ({ config }: useProcessTwitchVodOptions = {}) => {
    return useMutation<TempClip[], any, ProcessTwitchVodDTO>({
        onSuccess: (newTempClips) => {
            // Update temporary clips data by pushing the new generated clips if not existing
            queryClient.setQueryData<TempClip[] | null>(['temporaryClips'], (data) => {
                if (data) {
                    return [...data, ...newTempClips];
                }
            });
        },
        ...config,
        mutationFn: processTwitchVod,
    });
};

export default useProcessTwitchVod
