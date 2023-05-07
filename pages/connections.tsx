import AppLayout from "@/layouts/app";
import ConnectionsModule from "@/modules/Connections";
import withAuth from "@/components/hoc/withAuth";

const ConnectionsPage = () => (
    <AppLayout>
        <ConnectionsModule />
    </AppLayout>
);

export default withAuth(ConnectionsPage);
