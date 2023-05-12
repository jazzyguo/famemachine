import TemporaryClipsModule from "@/modules/Clips/temporary";
import withAuth from "@/components/hoc/withAuth";

const TemporaryClipsPage = () => <TemporaryClipsModule />;

export default withAuth(TemporaryClipsPage);
