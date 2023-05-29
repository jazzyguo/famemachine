import PublishModalModule from "@/modules/Publish/PublishModal";
import VideoIDModule from "@/modules/Twitch/VideoID";
import withAuth from "@/components/hoc/withAuth";

const TwitchVideoPage = () =>
    <>
        <PublishModalModule />
        <VideoIDModule />
    </>

export default withAuth(TwitchVideoPage);
