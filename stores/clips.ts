import { create } from "zustand";
import { ATHENA_API_URL } from "@/lib/consts/api";

interface Clips {
    savedClips: string[];
    temporaryClips: string[];
}

const useClipsStore = create<Clips>((set) => ({
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
}));

export default useClipsStore;
