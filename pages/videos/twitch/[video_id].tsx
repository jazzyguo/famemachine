import { TwitchVideosContextProvider } from "@/contexts/TwitchVideosContext";
import VideoIDModule from "@/modules/Twitch/VideoID";

const TwitchVideoPage = ({ prevPath }: { prevPath: string }) => (
    <TwitchVideosContextProvider>
        <VideoIDModule />
    </TwitchVideosContextProvider>
);

export default TwitchVideoPage;
