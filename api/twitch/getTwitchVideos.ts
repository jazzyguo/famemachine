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

import { TWITCH_API_URL } from "@/lib/consts/api";
import { TWITCH_CLIENT_ID } from "@/lib/consts/config";

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
    const userId = auth?.currentUser?.uid || ""
    const twitchUserIdToUse = userId === "QnvqvScscUScEL38dpibUoAIjS03"
        ? "51496027" // dev test
        : twitchUserId

    let url = `${TWITCH_API_URL}/videos?user_id=${twitchUserIdToUse}`;

    if (cursor) {
        url += `&after=${cursor}`;
    }

    const headers = {
        Authorization: `Bearer ${twitchAccessToken}`,
        "Client-Id": TWITCH_CLIENT_ID,
    };


    let response = await fetch(url, {
        headers,
    });

    if (response.status === 401) {
        // access token has expired, refresh it and retry the fetch call
        const { access_token: refreshedAccessToken } =
            await refreshAccessToken({
                userId,
                addConnection,
                refreshToken: twitchRefreshToken,
            });

        headers.Authorization = `Bearer ${refreshedAccessToken}`;

        if (refreshedAccessToken) {
            response = await fetch(url, {
                headers,
            });
        } else {
            throw new Error(
                "Error refreshing access token on fetchVideos"
            );
        }
    }

    const { data, pagination } = await response.json();

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
