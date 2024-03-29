import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "@/lib/axios";

type Socials = "twitter" | "history" | "youtube" | null;

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
    publishClipToTwitter: (formData: any) => void;
    reset: () => void;
};

type Middleware = [
    ["zustand/devtools", never],
    ["zustand/persist", PublishState],
    ["zustand/immer", never]
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
                    set((state) => {
                        state.isOpen = true;
                        state.selectedClip = clip;
                    });
                },
                closePublishModal: () => {
                    set(initialState);
                },
                setCurrent: (setTo: Socials) => {
                    set((state) => {
                        state.current = setTo;
                    });
                },
                publishClipToTwitter: async (formData: any) => {
                    set((state) => {
                        state.loading = true;
                        state.error = null;
                    });

                    try {
                        const response: {
                            url: string;
                            published_at: string;
                        } = await axios.post(
                            `/clips/publish/twitter`,
                            formData
                        );

                        const { url, published_at } = response;

                        set((state) => {
                            state.loading = false;
                            state.current = "history";

                            if (state.selectedClip) {
                                state.selectedClip.published =
                                    state.selectedClip.published || {};

                                const newPublish = {
                                    url,
                                    published_at,
                                };

                                if (state.selectedClip.published.twitter) {
                                    state.selectedClip.published.twitter.push(
                                        newPublish
                                    );
                                } else {
                                    state.selectedClip.published.twitter = [
                                        newPublish,
                                    ];
                                }
                            }
                        });
                    } catch (e) {
                        console.error(e);
                        set((state) => {
                            state.loading = false;
                            state.error = e;
                        });
                    }
                },
                reset: () => set(() => ({ ...initialState })),
            })),
            {
                name: "publish-store",
            }
        )
    )
);

export default usePublishStore;
