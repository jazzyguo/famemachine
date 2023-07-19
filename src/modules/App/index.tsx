import { ReactNode } from "react";
import AppProvider from "./Providers/AppProvider";
import AppLayout from "@/layouts/App";

/**
 * HOC for the global app
 */
const AppModule = ({ children }: { children: ReactNode }) => (
    <AppProvider>
        <AppLayout>{children}</AppLayout>
    </AppProvider>
);

export default AppModule;
