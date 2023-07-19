import TemporaryClipsModule from "@/modules/Clips/temporary";
import PublishModalModule from "@/modules/Publish/PublishModal";
import withAuth from "@/components/hoc/withAuth";

const TemporaryClipsPage = () =>
    <>
        <PublishModalModule />
        <TemporaryClipsModule />
    </>

export default withAuth(TemporaryClipsPage);
