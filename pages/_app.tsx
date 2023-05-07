import type { AppProps } from "next/app";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { IntegrationsContextProvider } from "@/contexts/IntegrationsContext";

import "@/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => (
    <AuthContextProvider>
        <IntegrationsContextProvider>
            <Component {...pageProps} />
        </IntegrationsContextProvider>
    </AuthContextProvider>
);

export default App;
