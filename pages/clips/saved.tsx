import ClipsModule from "@/modules/Clips";
import withAuth from "@/components/hoc/withAuth";

const SavedClipsPage = () => <ClipsModule />;

export default withAuth(SavedClipsPage);
