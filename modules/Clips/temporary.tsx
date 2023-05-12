import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useClipsStore from "@/stores/clips";

const TemporaryClipsModule = () => {
    const { user } = useAuth();

    const getTemporaryClips = useClipsStore((state) => state.getTemporaryClips);

    const clips = useClipsStore((state) => state.temporaryClips);

    useEffect(() => {
        getTemporaryClips(user.uid);
    }, [getTemporaryClips, user.uid]);

    console.log({ clips });

    return <div>clips</div>;
};

export default TemporaryClipsModule;
