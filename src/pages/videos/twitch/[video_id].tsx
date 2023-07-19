import { useRouter } from "next/router";
import PublishModalModule from "@/modules/Publish/PublishModal";
import VideoIDModule from "@/modules/Twitch/VideoID";
import withAuth from "@/components/hoc/withAuth";

const TwitchVideoPage = () => {
    const router = useRouter();
    const { video_id } = router.query;

    const videoId =
        video_id && (typeof video_id === 'string' ? video_id : video_id[0]) || ''

    return (
        <>
            <PublishModalModule />
            <VideoIDModule
                videoId={videoId}
            />
        </>
    )
}


export default withAuth(TwitchVideoPage);
