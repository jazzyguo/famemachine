import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { ATHENA_API_URL } from "@/lib/consts/api";

interface ClipsState {
    savedClips: SavedClip[] | null;
    temporaryClips: TempClip[] | null;
    loading: boolean;
    lastTimeFetchedTemp: string;
    error: any;
}

type Actions = {
    getSavedClips: (userId: string) => void;
    getTemporaryClips: (userId: string) => void;
    saveClip: ({ userId, s3Key }: { userId: string; s3Key: string }) => void;
    unsaveClip: ({ userId, s3Key }: { userId: string; s3Key: string }) => void;
    processTwitchVod: ({ userId, timestamp, videoId }: { userId: string, timestamp: [number, number], videoId: string }) => Promise<TempClip[]>
    reset: () => void;
};

type Middleware = [
    ["zustand/devtools", never],
    ["zustand/persist", ClipsState],
    ["zustand/immer", never],
];

const initialState: ClipsState = {
    savedClips: null,
    temporaryClips: null,
    loading: false,
    lastTimeFetchedTemp: "",
    error: null,
};

const useClipsStore = create<ClipsState & Actions, Middleware>(
    devtools(
        persist(
            immer((set) => ({
                ...initialState,

                getSavedClips: async (userId: string) => {
                    set(state => {
                        state.loading = true
                        state.error = null
                    });

                    try {
                        const response = await fetch(
                            `${ATHENA_API_URL}/clips/saved?user_id=${userId}`
                        );

                        const data = await response.json();

                        set(state => {
                            state.savedClips = data
                            state.loading = false
                        });
                    } catch (e: any) {
                        console.error(e);
                        set(state => {
                            state.loading = false
                            state.error = e
                        });
                    }
                },
                getTemporaryClips: async (userId: string) => {
                    set(state => {
                        state.loading = true
                        state.error = null
                    });

                    try {
                        const response = await fetch(
                            `${ATHENA_API_URL}/clips/temporary?user_id=${userId}`
                        );

                        const data = await response.json();

                        set(state => {
                            state.temporaryClips = data
                            state.loading = false
                            state.lastTimeFetchedTemp = new Date().toISOString()
                        });
                    } catch (e) {
                        console.error(e);
                        set(state => {
                            state.loading = false
                            state.error = e
                        });
                    }
                },
                saveClip: async ({
                    userId,
                    s3Key,
                }: {
                    userId: string;
                    s3Key: string;
                }) => {
                    try {
                        const response = await fetch(`${ATHENA_API_URL}/clips/save`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                s3_key: s3Key,
                                user_id: userId,
                            }),
                        });

                        const data = await response.json();

                        set(state => {
                            if (state.savedClips) {
                                state.savedClips.push(data)
                            }
                        })
                    } catch (e: any) {
                        console.error(e);
                    }
                },
                unsaveClip: async ({
                    userId,
                    s3Key,
                }: {
                    userId: string;
                    s3Key: string;
                }) => {
                    try {
                        const response = await fetch(`${ATHENA_API_URL}/clips/save`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                s3_key: s3Key,
                                user_id: userId,
                            }),
                        });

                        if (response.status === 200) {
                            const { key, temp_url, created_at } = await response.json()

                            set((state) => {
                                // check if the deleted clip is not already in the temp store
                                const tempClipExists = state.temporaryClips?.find(clip =>
                                    clip.key === key
                                )

                                const updatedSavedClips = (state.savedClips || []).filter(
                                    (clip) => clip.key !== s3Key
                                )

                                state.loading = false
                                state.savedClips = updatedSavedClips

                                if (!tempClipExists && state.temporaryClips) {
                                    state.temporaryClips.push({
                                        key,
                                        url: temp_url,
                                        created_at,
                                    })
                                }
                            });
                        }
                    } catch (e: any) {
                        console.error(e);
                    }
                },
                processTwitchVod: async ({
                    timestamp,
                    userId,
                    videoId,
                }: {
                    timestamp: [number, number]
                    userId: string
                    videoId: string
                }) => {
                    set(state => {
                        state.loading = true
                        state.error = null
                    });

                    try {
                        const response = await fetch(
                            `${ATHENA_API_URL}twitch/process_vod/${videoId}`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    user_id: userId,
                                    start: timestamp[0],
                                    end: timestamp[1],
                                }),
                            }
                        );

                        if (response.status === 200) {
                            const { clips }: { clips: TempClip[] } = await response.json();

                            set(state => {
                                state.loading = false

                                if (state.temporaryClips) {
                                    state.temporaryClips.push(...clips)
                                }
                            })

                            return clips
                        } else {
                            throw new Error("Error fetching clips");
                        }
                    } catch (e: any) {
                        console.log(e);
                        set(state => {
                            state.loading = false
                            state.error = e
                        });

                        return []
                    }
                },
                reset: () => set(initialState),
            })),
            {
                name: "clips-store",
            }
        ))
);

export default useClipsStore;
