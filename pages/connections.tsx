import ConnectionsModule from "@/modules/Connections";
import withAuth from "@/components/hoc/withAuth";

const ConnectionsPage = () => <ConnectionsModule />;

export default withAuth(ConnectionsPage);
