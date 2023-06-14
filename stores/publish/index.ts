import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { ATHENA_API_URL } from "@/lib/consts/api";

type Socials = 'twitter' | 'history' | null

interface PublishState {
    selectedClip: SavedClip | null;
    current: Socials;
    loading: boolean;
    isOpen: boolean;
    error: any;
}

type Actions = {
    openPublishModalWithClip: (clip: SavedClip | null) => void;
    closePublishModal: () => void;
    setCurrent: (setTo: Socials) => void;
    publishClipToTwitter: (formData: any, accessToken: string) => void;
    reset: () => void;
};

type Middleware = [
    ["zustand/devtools", never],
    ["zustand/persist", PublishState],
    ["zustand/immer", never],
];

const initialState: PublishState = {
    selectedClip: null,
    current: null,
    loading: false,
    error: null,
    isOpen: false,
};

const usePublishStore = create<PublishState & Actions, Middleware>(
    devtools(
        persist(
            immer((set) => ({
                ...initialState,

                openPublishModalWithClip: (clip: SavedClip | null) => {
                    set(state => {
                        state.isOpen = true
                        state.selectedClip = clip
                    })
                },
                closePublishModal: () => {
                    set(initialState)
                },
                setCurrent: (setTo: Socials) => {
                    set(state => {
                        state.current = setTo
                    })
                },
                publishClipToTwitter: async (formData: any, accessToken: string) => {
                    set(state => {
                        state.loading = true
                        state.error = null
                    })

                    try {
                        const response = await fetch(
                            `${ATHENA_API_URL}/clips/publish/twitter`,
                            {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                                body: formData,
                            }
                        );

                        if (response.status !== 200) {
                            throw new Error('Error publlishing twitter video')
                        }

                        const { url, published_at } = await response.json();

                        set(state => {
                            state.loading = false
                            state.current = 'history'

                            if (state.selectedClip) {
                                state.selectedClip.published = state.selectedClip.published || {}

                                const newPublish = {
                                    url,
                                    published_at,
                                }

                                if (state.selectedClip.published.twitter) {
                                    state.selectedClip.published.twitter.push(newPublish)
                                } else {
                                    state.selectedClip.published.twitter = [newPublish]
                                }
                            }
                        });
                    } catch (e) {
                        console.error(e);
                        set(state => {
                            state.loading = false
                            state.error = e
                        });
                    }
                },
                reset: () => set(initialState),
            })), {
            name: "publish-store",
        })
    )
);

export default usePublishStore;
