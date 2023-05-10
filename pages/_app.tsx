import AppModule from "@/modules/App";
import { AppProps } from "next/app";

import "@/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => (
    <AppModule>
        <Component {...pageProps} />
    </AppModule>
);

export default App;
