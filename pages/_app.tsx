import type { AppProps } from "next/app";
import { AuthContextProvider } from "@/contexts/AuthContext";

import "@/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => (
    <AuthContextProvider>
        <Component {...pageProps} />
    </AuthContextProvider>
);

export default App;
