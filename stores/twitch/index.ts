import { create } from "zustand";
import { persist, combine, devtools } from "zustand/middleware";
import { TWITCH_API_URL } from "@/lib/consts/api";
import { TWITCH_CLIENT_ID } from "@/lib/consts/config";

import refreshAccessToken from "./actions/refreshAccessToken";

const initialState: TwitchState = {
    videos: [],
    loading: false,
    error: null,
    pagination: {
        cursor: null,
        isLastPage: false,
    },
};

type Middleware = [
    ["zustand/devtools", never],
    ["zustand/persist", TwitchState]
];

const useTwitchStore = create<TwitchState & Actions, Middleware>(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // both fetchTwitchVideos and fetchTwitchVideo contain token refresh logic on 401
                fetchTwitchVideos: async ({
                    paginateTo,
                    twitchUserId,
                    twitchAccessToken,
                    addConnection,
                    userId,
                    refreshToken,
                }) => {
                    set({ loading: true, error: null });

                    try {
                        const cursor = get().pagination.cursor;

                        let newData: TwitchVideo[] = [];

                        let url = `${TWITCH_API_URL}/videos?user_id=51496027&first=20`; //`${TWITCH_API_URL}/videos?user_id=${twitchUserId}`,

                        if (cursor && paginateTo) {
                            url += `&${paginateTo}=${cursor}`;
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
                                    refreshToken,
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

                        if (response.status === 200) {
                            const { data, pagination } = await response.json();

                            newData = data;

                            set((state) => ({
                                videos: [
                                    // in the case we go to a video id page,
                                    // and append a video object to the main array from fetchTwitchVideo
                                    // we potentially have dupes, so remove incoming dupes
                                    ...state.videos.filter(
                                        (video) =>
                                            !newData.find(
                                                (newVideo) =>
                                                    newVideo.id === video.id
                                            )
                                    ),
                                    ...newData,
                                ],
                                pagination: {
                                    cursor: pagination.cursor,
                                    isLastPage: !pagination.cursor,
                                },
                                loading: false,
                            }));
                        } else {
                            throw new Error("Error fetching twitch videos");
                        }
                    } catch (e: any) {
                        console.log(e);
                        set({ error: e, loading: false });
                    }
                },
                fetchTwitchVideo: async ({
                    twitchAccessToken,
                    videoId,
                    addConnection,
                    userId,
                    refreshToken,
                }) => {
                    set({ loading: true, error: null });

                    try {
                        const headers = {
                            Authorization: `Bearer ${twitchAccessToken}`,
                            "Client-Id": TWITCH_CLIENT_ID,
                        };

                        const url = `${TWITCH_API_URL}/videos/?id=${videoId}`;

                        let response = await fetch(url, { headers });

                        if (response.status === 401) {
                            const { access_token: refreshedAccessToken } =
                                await refreshAccessToken({
                                    addConnection,
                                    userId,
                                    refreshToken,
                                });

                            headers.Authorization = `Bearer ${refreshedAccessToken}`;

                            response = await fetch(url, { headers });
                        }

                        if (response.status === 200) {
                            const { data } = await response.json();

                            const video = data && data[0];

                            // replace the current state index with the new video if exists
                            set((state) => {
                                const existingIndex = state.videos.findIndex(
                                    ({ id }) => id === video.id
                                );

                                let updatedVideos = [...state.videos];

                                if (existingIndex !== -1) {
                                    updatedVideos[existingIndex] = video;
                                } else {
                                    updatedVideos.push(video);
                                }

                                return {
                                    videos: updatedVideos,
                                    loading: false,
                                };
                            });
                        }
                    } catch (e: any) {
                        console.log(e);
                        set({ loading: false, error: e });
                    }
                },
            }),
            {
                name: "twitch-videos-store",
            }
        )
    )
);

export default useTwitchStore;
