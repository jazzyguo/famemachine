import { useMutation } from '@tanstack/react-query';

import axios from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';

type SaveClipDTO = {
    s3Key: string;
};

const saveClip = ({ s3Key }: SaveClipDTO): Promise<SavedClip> => {
    return axios.post('/clips/save', { s3_key: s3Key });
};

type useSaveClipsOptions = {
    config?: MutationConfig<typeof saveClip>;
};

const useSaveClip = ({ config }: useSaveClipsOptions = {}) => {
    return useMutation({
        onSuccess: (newSavedClip) => {
            const previousClips = queryClient.getQueryData<SavedClip[]>(['savedClips']) || [];

            queryClient.setQueryData(
                ['savedClips'],
                [...previousClips, newSavedClip]
            );
        },
        ...config,
        mutationFn: saveClip,
    });
};

export default useSaveClip
