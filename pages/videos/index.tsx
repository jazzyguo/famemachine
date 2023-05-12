import { GetServerSidePropsContext } from "next";
import VideosModule from "@/modules/Videos";
import { TwitchVideosContextProvider } from "@/contexts/TwitchVideosContext";
import withAuth from "@/components/hoc/withAuth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            prevPath: context.req.headers.referer,
        },
    };
}

const VideosPage = ({ prevPath }: { prevPath: string }) => (
    <TwitchVideosContextProvider prevPath={prevPath}>
        <VideosModule />
    </TwitchVideosContextProvider>
);

export default withAuth(VideosPage);
