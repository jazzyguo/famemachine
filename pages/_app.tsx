import type { AppProps } from "next/app";
import Auth0Provider from "@/components/Auth0/Provider";
import "@/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => (
    <Auth0Provider>
        <Component {...pageProps} />
    </Auth0Provider>
);

export default App;
