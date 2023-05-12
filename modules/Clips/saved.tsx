import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useClipsStore from "@/stores/clips";

const SavedClipsModule = () => {
    const { user } = useAuth();

    const getSavedClips = useClipsStore((state) => state.getSavedClips);

    const clips = useClipsStore((state) => state.savedClips);

    useEffect(() => {
        getSavedClips(user.uid);
    }, [getSavedClips, user.uid]);

    console.log({ clips });

    return <div>clips</div>;
};

export default SavedClipsModule;
