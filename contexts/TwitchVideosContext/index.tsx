import React, {
    ReactNode,
    createContext,
    useContext,
    useMemo,
    useReducer,
    useCallback,
} from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useConnectionsAPI } from "@/contexts/ConnectionsContext";

import fetchTwitchVideos from "./actions/fetchTwitchVideos";
import refreshAccessToken from "./actions/refreshAccessToken";

import { State } from "./types";
import reducer, { initialState, localStorageKey } from "./reducer";

export const TwitchVideosContext = createContext<State>(initialState);
export const TwitchVideosAPIContext = createContext<{
    [key: string]: (any?: any) => any;
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
    prevPath = "",
    children,
}: {
    prevPath?: string;
    children: ReactNode;
}) => {
    const { twitch } = useConnections();
    const { addConnection } = useConnectionsAPI();
    const { user } = useAuth();

    const previousPathContainedVideo = prevPath.includes("/video");

    // maintain local storage state if coming from video id page
    const [state, dispatch] = useReducer(
        reducer,
        previousPathContainedVideo
            ? JSON.parse(localStorage.getItem(localStorageKey) || "null") ||
                  initialState
            : initialState
    );

    const {
        access_token: accessToken,
        user_id: userId,
        refresh_token: refreshToken,
    } = twitch || {};

    // this function should be passed to every action called such as fetchTwitchVideos
    // to create refresh logic in the case of expired access tokens
    const _refreshAccessToken = useCallback(async () => {
        const { access_token, refresh_token } = await refreshAccessToken({
            userId: user?.uid,
            refreshToken,
            addConnection,
        });

        return {
            access_token,
            refresh_token,
        };
    }, [refreshToken, user?.uid, addConnection]);

    const _fetchTwitchVideos = useCallback(
        async (paginateTo: "before" | "after" | undefined) => {
            await fetchTwitchVideos({
                cursor: state.pagination.cursor,
                accessToken,
                userId,
                refreshAccessToken: _refreshAccessToken,
                dispatch,
                paginateTo,
            });
        },
        [
            accessToken,
            userId,
            _refreshAccessToken,
            dispatch,
            state.pagination.cursor,
        ]
    );

    const stateValue = useMemo(() => state, [state]);

    return (
        <TwitchVideosContext.Provider value={stateValue}>
            <TwitchVideosAPIContext.Provider
                value={{
                    fetchTwitchVideos: _fetchTwitchVideos,
                    refreshAccessToken: _refreshAccessToken,
                }}
            >
                {children}
            </TwitchVideosAPIContext.Provider>
        </TwitchVideosContext.Provider>
    );
};
