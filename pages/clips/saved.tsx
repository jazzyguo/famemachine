import PublishModalModule from "@/modules/Publish/PublishModal";
import SavedClipsModule from "@/modules/Clips/saved";
import withAuth from "@/components/hoc/withAuth";

const SavedClipsPage = () =>
    <>
        <PublishModalModule />
        <SavedClipsModule />
    </>

export default withAuth(SavedClipsPage);
