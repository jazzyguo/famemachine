import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ATHENA_API_URL } from "@/lib/consts/api";

interface ClipsState {
    savedClips: string[];
    temporaryClips: string[];

    getSavedClips: (userId: string) => void;
    getTemporaryClips: (userId: string) => void;
}

const useClipsStore = create<ClipsState, [["zustand/persist", ClipsState]]>(
    persist(
        (set) => ({
            savedClips: [],
            temporaryClips: [],

            getSavedClips: async (userId: string) => {
                try {
                    const response = await fetch(
                        `${ATHENA_API_URL}/clips/saved?user_id=${userId}`
                    );

                    const data = await response.json();

                    set({ savedClips: data });
                } catch (error) {
                    console.error(error);
                }
            },

            getTemporaryClips: async (userId: string) => {
                try {
                    const response = await fetch(
                        `${ATHENA_API_URL}/clips/temporary?user_id=${userId}`
                    );

                    const data = await response.json();

                    set({ temporaryClips: data });
                } catch (error) {
                    console.error(error);
                }
            },
        }),
        {
            name: "clips",
            getStorage: () => localStorage,
        }
    )
);

export default useClipsStore;
