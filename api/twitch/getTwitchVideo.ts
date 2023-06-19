import { useQuery } from '@tanstack/react-query';
import { getAuth } from "firebase/auth";
import app from "@/firebase/config";

import { AddConnectionAction } from '@/contexts/ConnectionsContext';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import {
    useConnections,
    useConnectionsAPI,
} from "@/contexts/ConnectionsContext";
import refreshAccessToken from "./utils/refreshAccessToken";

import axios from '@/lib/axios/twitch'

const auth = getAuth(app);

export type GetTwitchVideoDTO = {
    videoId?: string | undefined;
};

const getTwitchVideo = async ({
    videoId,
    twitchUserId,
    twitchAccessToken,
    twitchRefreshToken,
    addConnection,
}: {
    twitchUserId: string,
    twitchAccessToken: string
    twitchRefreshToken: string
    addConnection: AddConnectionAction
} & GetTwitchVideoDTO): Promise<TwitchVideo> => {
    const userId = auth?.currentUser?.uid || ""

    const url = `/videos/?id=${videoId}`;

    const headers = {
        Authorization: `Bearer ${twitchAccessToken}`,
    };


    let response: {
        data: {
            data: TwitchVideo[],
            pagination: {
                cursor: string | null
            }
        }
        status: number,
    } = await axios.get(url, {
        headers,
    });

    if (response.status === 401) {
        // access token has expired, refresh it and retry the fetch call
        const { access_token: refreshedAccessToken } =
            await refreshAccessToken({
                twitchUserId,
                userId,
                addConnection,
                refreshToken: twitchRefreshToken,
            });

        headers.Authorization = `Bearer ${refreshedAccessToken}`;

        if (refreshedAccessToken) {
            response = await axios.get(url, {
                headers,
            });
        } else {
            throw new Error(
                "Error refreshing access token on fetchVideos"
            );
        }
    }

    const { data: { data } } = await response;
    const video = data && data[0];

    return video
}

type QueryFnType = typeof getTwitchVideo;

type useTwitchVideosOptions = {
    config?: QueryConfig<QueryFnType>;
} & GetTwitchVideoDTO

const useTwitchVideo = ({ config, videoId }: useTwitchVideosOptions = {}) => {
    const { twitch = {} } = useConnections();
    const { addConnection } = useConnectionsAPI();

    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: ['twitchVideo', videoId],
        queryFn: () => getTwitchVideo({
            videoId,
            twitchUserId: twitch.user_id,
            twitchAccessToken: twitch.access_token,
            twitchRefreshToken: twitch.refresh_token,
            addConnection,
        }),
        enabled: !!twitch.user_id && !!twitch.access_token && !!twitch.refresh_token && !!videoId,
    });
};

export default useTwitchVideo
