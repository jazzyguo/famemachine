import { ReactNode } from "react";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { ConnectionsContextProvider } from "@/contexts/ConnectionsContext";
import StyleProvider from "./components/StyleProvider";
import AppLayout from "@/layouts/App";

/**
 * HOC for the global app
 */
const AppModule = ({ children }: { children: ReactNode }) => (
    <StyleProvider>
        <AuthContextProvider>
            <ConnectionsContextProvider>
                <AppLayout>{children}</AppLayout>
            </ConnectionsContextProvider>
        </AuthContextProvider>
    </StyleProvider>
);

export default AppModule;
