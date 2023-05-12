import VideoIDModule from "@/modules/Twitch/VideoID";
import withAuth from "@/components/hoc/withAuth";

const TwitchVideoPage = () => <VideoIDModule />;

export default withAuth(TwitchVideoPage);
