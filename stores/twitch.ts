import create from "zustand";
import { persist } from "zustand/middleware";
import { isEmpty } from "lodash";

import { useAuth } from "@/contexts/AuthContext";
import {
    useConnections,
    useConnectionsAPI,
} from "@/contexts/ConnectionsContext";
import fetchTwitchVideos from "./actions/fetchTwitchVideos";
import refreshAccessToken from "./actions/refreshAccessToken";

interface TwitchState {
    videos: any[];
    pagination: {
        cursor: string | null;
        isLastPage: boolean;
    };
    fetchTwitchVideos: (paginateTo: string) => void;
    refreshAccessToken: () => Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}

const useTwitchVideosStore = create<TwitchVideosStore>(
    persist(
        (set, get) => ({
            videos: [],
            pagination: {
                cursor: null,
                isLastPage: false,
            },
            fetchTwitchVideos: async (paginateTo) => {
                const { twitch } = useConnections(get());
                const { addConnection } = useConnectionsAPI(get());
                const { user } = useAuth();

                const state = get();

                const {
                    access_token: accessToken,
                    user_id: userId,
                } = twitch || {};

                set({ ...state, loading: true, error: null });

                await fetchTwitchVideos({
                    cursor: state.pagination.cursor,
                    accessToken,
                    userId,
                    refreshAccessToken: get().refreshAccessToken,
                    dispatch: set,
                    paginateTo,
                });

            },
            refreshAccessToken: async () => {
                const { twitch } = useConnections(get());
                const { addConnection } = useConnectionsAPI(get());
                const { user } = useAuth();

                const { refresh_token: refreshToken } = twitch || {};

                const { access_token, refresh_token } =
                    await refreshAccessToken({
                        userId: user?.uid,
                        refreshToken,
                        addConnection,
                    });

                return {
                    access_token,
                    refresh_token,
                };
            },
        }),
        {
            name: "twitch-videos-store",
            getStorage: () => localStorage,
        }
    )
);
