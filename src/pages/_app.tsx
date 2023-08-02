import "@/styles/globals.scss";

import AppModule from "@/modules/App";
import { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => (
    <AppModule>
        <Component {...pageProps} />
    </AppModule>
);

export default App;
