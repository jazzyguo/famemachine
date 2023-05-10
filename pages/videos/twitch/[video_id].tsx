import { useRouter } from "next/router";

const TwitchVideoPage = () => {
    const router = useRouter();
    const { video_id } = router.query;

    return <div>{video_id}</div>;
};

export default TwitchVideoPage;
