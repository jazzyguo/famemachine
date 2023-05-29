import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ATHENA_API_URL } from "@/lib/consts/api";

type Socials = 'twitter' | null

interface PublishState {
    selectedClip: SavedClip | TempClip | null;
    current: Socials;
    loading: boolean;
    isOpen: boolean;
    error: any;
    publishedUrl: string,
}

type Actions = {
    openPublishModalWithClip: (clip: SavedClip | TempClip | null) => void;
    closePublishModal: () => void;
    setCurrent: (setTo: Socials) => void;
    publishClipToTwitter: (formData: any) => void;
    reset: () => void;
};

type Middleware = [
    ["zustand/devtools", never],
    ["zustand/persist", PublishState]
];

const initialState: PublishState = {
    selectedClip: null,
    current: null,
    loading: false,
    error: null,
    isOpen: false,
    publishedUrl: '',
};

const usePublishStore = create<PublishState & Actions, Middleware>(
    devtools(
        persist((set) => ({
            ...initialState,

            openPublishModalWithClip: (clip: SavedClip | TempClip | null) => {
                set({ isOpen: true, selectedClip: clip })
            },
            closePublishModal: () => {
                set(initialState)
            },
            setCurrent: (setTo: Socials) => {
                set({ current: setTo, publishedUrl: '' })
            },
            publishClipToTwitter: async (formData: any) => {
                set({ loading: true, error: null })

                try {
                    const response = await fetch(
                        `${ATHENA_API_URL}/clips/publish/twitter`,
                        {
                            method: 'POST',
                            body: formData,
                        }
                    );

                    if (response.status !== 200) {
                        throw new Error('Error publlishing twitter video')
                    }

                    const { tweet_url } = await response.json();

                    set({ loading: false, publishedUrl: tweet_url });
                } catch (e) {
                    console.error(e);
                    set({ loading: false, error: e });
                }
            },
            reset: () => set(initialState),
        }), {
            name: "publish-store",
        })
    )
);

export default usePublishStore;
