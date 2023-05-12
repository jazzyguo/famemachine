import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { ConnectionsContextProvider } from "@/contexts/ConnectionsContext";
import StyleProvider from "./components/StyleProvider";
import AppLayout from "@/layouts/App";

/**
 * HOC for the global app
 */
const AppModule = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <StyleProvider>
                <AuthContextProvider>
                    <ConnectionsContextProvider>
                        <AppLayout>{children}</AppLayout>
                    </ConnectionsContextProvider>
                </AuthContextProvider>
            </StyleProvider>
        </PersistGate>
    </Provider>
);

export default AppModule;
