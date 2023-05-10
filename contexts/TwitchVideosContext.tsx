import React, {
    ReactNode,
    createContext,
    useContext,
    useMemo,
    useReducer,
    useCallback,
} from "react";
import { useConnections } from "@/contexts/ConnectionsContext";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { TWITCH_API_URL } from "@/utils/consts/api";

type Video = {
    id: string;
    title: string;
    url: string;
    thumbnail_url: string;
    createdAt: string;
};

type State = {
    videos: Video[];
    loading: boolean;
    error: string | null;
    pagination: {
        cursor: string | null;
        limit: number;
    };
};

type Action =
    | { type: "FETCH_VIDEOS_REQUEST" }
    | {
          type: "FETCH_VIDEOS_SUCCESS";
          payload: { videos: Video[]; pagination: { cursor: string } };
      }
    | { type: "FETCH_VIDEOS_FAILURE"; payload: { error: string } };

const initialState: State = {
    videos: [],
    loading: false,
    error: null,
    pagination: {
        cursor: null,
        limit: 20,
    },
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "FETCH_VIDEOS_REQUEST":
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "FETCH_VIDEOS_SUCCESS":
            return {
                ...state,
                loading: false,
                videos: action.payload.videos,
                pagination: {
                    ...state.pagination,
                    cursor: action.payload.pagination.cursor,
                },
            };
        case "FETCH_VIDEOS_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        default:
            return state;
    }
};

export const TwitchVideosContext = createContext<State>(initialState);
export const TwitchVideosAPIContext = createContext<{
    [key: string]: () => void;
}>({});

export const useTwitchVideos = () => useContext(TwitchVideosContext);
export const useTwitchVideosAPI = () => useContext(TwitchVideosAPIContext);

/**
 *
 * Provides videos state fetched from twitch.
 *
 * Used in modules/Videos/index.tsx
 */
export const TwitchVideosContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { twitch } = useConnections();
    const [state, dispatch] = useReducer(reducer, initialState);

    const { access_token: accessToken, user_id: userId } = twitch;

    const fetchTwitchVideos = useCallback(async () => {
        if (accessToken) {
            dispatch({ type: "FETCH_VIDEOS_REQUEST" });

            try {
                const response = await fetch(
                    //`${TWITCH_API_URL}/videos?user_id=${userId}`,
                    `${TWITCH_API_URL}/videos?user_id=51496027`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Client-Id": publicRuntimeConfig.TWITCH_CLIENT_ID,
                        },
                    }
                );
                const { data, pagination } = await response.json();

                const videos = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    thumbnail: item.thumbnail_url,
                    url: item.url,
                    createdAt: item.created_at,
                }));

                dispatch({
                    type: "FETCH_VIDEOS_SUCCESS",
                    payload: { videos, pagination },
                });
            } catch (error: any) {
                dispatch({
                    type: "FETCH_VIDEOS_FAILURE",
                    payload: { error: error.message },
                });
            }
        }
    }, [accessToken, userId]);

    const stateValue = useMemo(() => state, [state]);

    return (
        <TwitchVideosContext.Provider value={stateValue}>
            <TwitchVideosAPIContext.Provider value={{ fetchTwitchVideos }}>
                {children}
            </TwitchVideosAPIContext.Provider>
        </TwitchVideosContext.Provider>
    );
};
