import { useInfiniteQuery } from '@tanstack/react-query';
import { getAuth } from "firebase/auth";
import app from "@/firebase/config";

import { AddConnectionAction } from '@/contexts/ConnectionsContext';
import { ExtractFnReturnType, InfiniteQueryConfig } from '@/lib/react-query';

import {
    useConnections,
    useConnectionsAPI,
} from "@/contexts/ConnectionsContext";
import refreshAccessToken from "./utils/refreshAccessToken";

import axios from '@/lib/axios/twitch'

const auth = getAuth(app);

const getTwitchVideos = async ({
    twitchUserId,
    twitchAccessToken,
    twitchRefreshToken,
    addConnection,
    cursor,
}: {
    twitchUserId: string
    twitchAccessToken: string
    twitchRefreshToken: string
    addConnection: AddConnectionAction
    cursor: string | null;
}): Promise<{
    videos: TwitchVideo[];
    pagination: {
        cursor: string | null
    }
}> => {
    const userEmail = auth?.currentUser?.email || ""
    const twitchUserIdToUse = userEmail === "guojazzy@gmail.com"
        ? "51496027" // dev test
        : twitchUserId

    let url = `/videos?user_id=${twitchUserIdToUse}`;

    if (cursor) {
        url += `&after=${cursor}`;
    }

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

    const { data: { data, pagination } } = await response;

    return {
        videos: data,
        pagination
    }
}

type QueryFnType = typeof getTwitchVideos;

type useTwitchVideosOptions = {
    config?: InfiniteQueryConfig<QueryFnType>;
};

const useTwitchVideos = ({ config }: useTwitchVideosOptions = {}) => {
    const { twitch = {} } = useConnections();
    const { addConnection } = useConnectionsAPI();

    return useInfiniteQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: ['twitchVideos', twitch],
        queryFn: ({ pageParam }) => getTwitchVideos({
            twitchUserId: twitch.user_id,
            twitchAccessToken: twitch.access_token,
            twitchRefreshToken: twitch.refresh_token,
            addConnection,
            cursor: pageParam as string | null,
        }),
        getNextPageParam: (lastPage) => lastPage.pagination.cursor || null,
        enabled: !!twitch.user_id && !!twitch.access_token && !!twitch.refresh_token,
    });
};

export default useTwitchVideos
