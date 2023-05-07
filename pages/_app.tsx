import type { AppProps } from "next/app";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { ConnectionsContextProvider } from "@/contexts/ConnectionsContext";

import "@/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => (
    <AuthContextProvider>
        <ConnectionsContextProvider>
            <Component {...pageProps} />
        </ConnectionsContextProvider>
    </AuthContextProvider>
);

export default App;
