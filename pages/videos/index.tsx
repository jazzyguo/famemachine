import VideosModule from "@/modules/Videos";
import { GetServerSidePropsContext } from "next";
import { TwitchVideosContextProvider } from "@/contexts/TwitchVideosContext";

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

export default VideosPage;
