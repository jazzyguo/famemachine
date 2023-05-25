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
}

type Actions = {
    openPublishModalWithClip: (clip: SavedClip | TempClip | null) => void;
    closePublishModal: () => void;
    setCurrent: (setTo: Socials) => void;
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
};

const usePublishStore = create<PublishState & Actions, Middleware>(
    devtools(
        persist((set) => ({
            ...initialState,

            openPublishModalWithClip: (clip: SavedClip | TempClip | null) => {
                set({ isOpen: true, selectedClip: clip })
            },
            closePublishModal: () => {
                set({ isOpen: false, selectedClip: null })
            },
            setCurrent: (setTo: Socials) => {
                set({ current: setTo })
            },
            reset: () => set(initialState),
        }), {
            name: "publish-store",
        })
    )
);

export default usePublishStore;
