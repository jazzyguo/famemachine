import React from "react";

import TwitchVideoLibrary from "@/modules/Twitch/VideoLibrary";
import { TwitchVideosContextProvider } from "@/contexts/TwitchVideosContext";

const VideosModule = ({ prevPath }: { prevPath: string }) => {
    return (
        <div style={{ width: "100%" }}>
            <TwitchVideosContextProvider prevPath={prevPath}>
                <TwitchVideoLibrary />
            </TwitchVideosContextProvider>
        </div>
    );
};

export default VideosModule;
