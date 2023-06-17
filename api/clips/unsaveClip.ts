import { useMutation } from '@tanstack/react-query';

import axios from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';

type UnsaveClipDTO = {
    s3Key: string;
};

const unsaveClip = ({ s3Key }: UnsaveClipDTO): Promise<TempClip> => {
    return axios.delete(`/clips/save?s3_key=${s3Key}`);
};

type useUnsaveClipsOptions = {
    config?: MutationConfig<typeof unsaveClip>;
};

const useUnsaveClip = ({ config }: useUnsaveClipsOptions = {}) => {
    return useMutation({
        onError: (_, __, context: any) => {
            if (context?.previousClips) {
                queryClient.setQueryData(['savedClips'], context.previousClips);
            }
        },
        onSuccess: (tempClip) => {
            // Update temporary clips data by pushing the deleted clip if not existing
            queryClient.setQueryData<TempClip[] | null>(['temporaryClips'], (data) => {
                if (data) {
                    const existingClip = data.find((clip) => clip.key === tempClip.key);
                    if (existingClip) {
                        return data;
                    }
                    return [...data, tempClip];
                }
            });

            // Update saved clips data
            queryClient.setQueryData<SavedClip[] | null>(['savedClips'], (data) => {
                if (data) {
                    return data.filter(({ key }) => key !== tempClip.key);
                }
                return [];
            });
        },
        ...config,
        mutationFn: unsaveClip,
    });
};

export default useUnsaveClip
