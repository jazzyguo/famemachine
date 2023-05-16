import { create } from "zustand";
import { devtools } from "zustand/middleware";
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
    reset: () => void;
};

type Middleware = [
    ["zustand/devtools", never],
    ["zustand/persist", ClipsState]
];

const initialState: ClipsState = {
    savedClips: null,
    temporaryClips: null,
    loading: false,
    error: null,
};

const useClipsStore = create<ClipsState & Actions, Middleware>(
    devtools((set) => ({
        ...initialState,

        getSavedClips: async (userId: string) => {
            set({ loading: true, error: null });

            try {
                const response = await fetch(
                    `${ATHENA_API_URL}/clips/saved?user_id=${userId}`
                );

                const data = await response.json();

                set({ savedClips: data, loading: false });
            } catch (e: any) {
                console.error(e);
                set({ loading: false, error: e });
            }
        },
        getTemporaryClips: async (userId: string) => {
            set({ loading: true, error: null });

            try {
                const response = await fetch(
                    `${ATHENA_API_URL}/clips/temporary?user_id=${userId}`
                );

                const data = await response.json();

                set({ temporaryClips: data, loading: false });
            } catch (e) {
                console.error(e);
                set({ loading: false, error: e });
            }
        },
        reset: () => set(initialState),
    }))
);

export default useClipsStore;
