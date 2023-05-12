import { TwitchVideosContextProvider } from "@/contexts/TwitchVideosContext";
import VideoIDModule from "@/modules/Twitch/VideoID";
import withAuth from "@/components/hoc/withAuth";

const TwitchVideoPage = () => (
    <TwitchVideosContextProvider>
        <VideoIDModule />
    </TwitchVideosContextProvider>
);

export default withAuth(TwitchVideoPage);
