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
import reducer, { initialState } from "./reducer";

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
    const { addConnection } = useConnectionsAPI();
    const { user } = useAuth();

    const [state, dispatch] = useReducer(reducer, initialState);

    const {
        access_token: accessToken,
        user_id: userId,
        refresh_token: refreshToken,
    } = twitch || {};

    // this function should be passed to every action called such as fetchTwitchVideos
    // to create refresh logic in the case of expired access tokens
    const _refreshAccessToken = useCallback(async () => {
        const { access_token, refresh_token } = await refreshAccessToken({
            userId: user.uid,
            twitchUserId: userId,
            refreshToken,
            addConnection,
        });

        return {
            access_token,
            refresh_token,
        };
    }, [userId, refreshToken, user.uid, addConnection]);

    const _fetchTwitchVideos = useCallback(async () => {
        await fetchTwitchVideos({
            accessToken,
            userId,
            refreshAccessToken: _refreshAccessToken,
            dispatch,
        });
    }, [accessToken, userId, _refreshAccessToken, dispatch]);

    const stateValue = useMemo(() => state, [state]);

    return (
        <TwitchVideosContext.Provider value={stateValue}>
            <TwitchVideosAPIContext.Provider
                value={{ fetchTwitchVideos: _fetchTwitchVideos }}
            >
                {children}
            </TwitchVideosAPIContext.Provider>
        </TwitchVideosContext.Provider>
    );
};
