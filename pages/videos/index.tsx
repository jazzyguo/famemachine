import VideosModule from "@/modules/Videos";
import { GetServerSidePropsContext } from "next";

import { VideosContextProvider } from "@/contexts/VideosContext";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            prevPath: context.req.headers.referer,
        },
    };
}

const VideosPage = ({ prevPath }: { prevPath: string }) => (
    <VideosContextProvider>
        <VideosModule prevPath={prevPath} />
    </VideosContextProvider>
);

export default VideosPage;
