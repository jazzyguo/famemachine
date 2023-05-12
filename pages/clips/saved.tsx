import SavedClipsModule from "@/modules/Clips/saved";
import withAuth from "@/components/hoc/withAuth";

const SavedClipsPage = () => <SavedClipsModule />;

export default withAuth(SavedClipsPage);
