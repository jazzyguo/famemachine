import VideosModule from "@/modules/Videos";

import { VideosContextProvider } from "@/contexts/VideosContext";

const VideosPage = () => (
    <VideosContextProvider>
        <VideosModule />
    </VideosContextProvider>
);

export default VideosPage;
