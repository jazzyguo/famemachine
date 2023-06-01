import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { ATHENA_API_URL } from "@/lib/consts/api";

interface ClipsState {
    savedClips: SavedClip[] | null;
    temporaryClips: TempClip[] | null;
    loading: boolean;
    error: any;
}

type Actions = {
    getSavedClips: (userId: string) => void;
    getTemporaryClips: (userId: string) => void;
    saveClip: ({ userId, s3Key }: { userId: string; s3Key: string }) => void;
    unsaveClip: ({ userId, s3Key }: { userId: string; s3Key: string }) => void;
    reset: () => void;
};

type Middleware = [
    ["zustand/devtools", never],
    ["zustand/immer", never],
];

const initialState: ClipsState = {
    savedClips: null,
    temporaryClips: null,
    loading: false,
    error: null,
};

const useClipsStore = create<ClipsState & Actions, Middleware>(
    devtools(
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
                        } else {
                            state.savedClips = [data]
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
            reset: () => set(initialState),
        }))
    )
);

export default useClipsStore;
