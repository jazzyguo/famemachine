import { ReactNode } from "react";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { ConnectionsContextProvider } from "@/contexts/ConnectionsContext";
import StyleProvider from "./StyleProvider";
import { QueryClientProvider, } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";


const AppModule = ({ children }: { children: ReactNode }) => (
    <StyleProvider>
        <AuthContextProvider>
            <ConnectionsContextProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </ConnectionsContextProvider>
        </AuthContextProvider>
    </StyleProvider>
);

export default AppModule;
