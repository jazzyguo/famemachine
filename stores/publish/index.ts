import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ATHENA_API_URL } from "@/lib/consts/api";

interface PublishState {
    selectedClip: SavedClip | TempClip | null;
    loading: boolean;
    isOpen: boolean;
    error: any;
}

type Actions = {
    openPublishModalWithClip: (clip: SavedClip | TempClip | null) => void;
    closePublishModal: () => void;
    reset: () => void;
};

type Middleware = [
    ["zustand/devtools", never],
    ["zustand/persist", PublishState]
];

const initialState: PublishState = {
    selectedClip: null,
    loading: false,
    error: null,
    isOpen: false,
};

const usePublishStore = create<PublishState & Actions, Middleware>(
    devtools((set) => ({
        ...initialState,

        openPublishModalWithClip: (clip: SavedClip | TempClip | null) => {
            set({ isOpen: true, selectedClip: clip })
        },
        closePublishModal: () => {
            set({ isOpen: false, selectedClip: null })
        },
        reset: () => set(initialState),
    }))
);

export default usePublishStore;
