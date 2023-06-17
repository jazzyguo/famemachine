import { useQuery } from '@tanstack/react-query';

import axios from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';


const getSavedClips = (): Promise<SavedClip[]> => {
    return axios.get(`/clips/saved`);
};

type QueryFnType = typeof getSavedClips;

type useSavedClipsOptions = {
    config?: QueryConfig<QueryFnType>;
};

const useSavedClips = ({ config }: useSavedClipsOptions = {}) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: ['savedClips'],
        queryFn: () => getSavedClips(),
    });
};

export default useSavedClips
