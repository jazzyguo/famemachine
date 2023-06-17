import { useQuery } from '@tanstack/react-query';

import axios from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';


const getTemporaryClips = (): Promise<TempClip[]> => {
    return axios.get(`/clips/temporary`);
};

type QueryFnType = typeof getTemporaryClips;

type useTemporaryClipsOptions = {
    config?: QueryConfig<QueryFnType>;
};

const useTemporaryClips = ({ config }: useTemporaryClipsOptions = {}) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: ['temporaryClips'],
        queryFn: () => getTemporaryClips(),
        refetchInterval: 24 * 60 * 60 * 1000 // refetching every 24 hours to prune expired clips
    });
};

export default useTemporaryClips
