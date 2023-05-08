import React from "react";

import TwitchVideoLibrary from "@/modules/Twitch/VideoLibrary";
import { TwitchVideosContextProvider } from "@/contexts/TwitchVideosContext";

const VideosModule = () => {
    return (
        <div>
            <TwitchVideosContextProvider>
                <TwitchVideoLibrary />
            </TwitchVideosContextProvider>
        </div>
    );
};

export default VideosModule;
