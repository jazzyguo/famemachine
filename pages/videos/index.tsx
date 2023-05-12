import VideosModule from "@/modules/Videos";
import withAuth from "@/components/hoc/withAuth";

const VideosPage = () => <VideosModule />;

export default withAuth(VideosPage);
