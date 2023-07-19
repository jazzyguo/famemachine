import {
    useState,
    useEffect,
    createContext,
    useContext,
    ReactNode,
    useCallback,
} from "react";
import getData from "@/firebase/firestore/getData";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

type Connection = {
    [key: string]: string;
};

type Connections = {
    [key: string]: Connection;
};

export type AddConnectionAction = (name: string, newConnection: Connection | null) => void;

export const ConnectionsContext = createContext<Connections>({});
export const ConnectionsAPIContext = createContext<{
    addConnection: AddConnectionAction
}>({ addConnection: () => undefined });

export const useConnections = () => useContext(ConnectionsContext);
export const useConnectionsAPI = () => useContext(ConnectionsAPIContext);

export const ConnectionsContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { user } = useAuth();
    const [connections, setConnections] = useState<Connections | null>(null);

    useEffect(() => {
        // fetch Connections from firestore
        const fetchUser = async () => {
            let fetchedConnections = {}

            if (user.uid) {
                const { error, result } = await getData("users", user.uid);

                if (error) {
                    throw new Error("Error fetching Connections");
                }

                if (result?.connections) {
                    fetchedConnections = result.connections
                }
            }

            setConnections(fetchedConnections)
        };

        try {
            fetchUser();
        } catch (e) {
            console.log(e);
        }
    }, [user]);

    const addConnection = useCallback(
        (name: string, newConnection: Connection | null) =>
            setConnections((prevState) => ({
                ...prevState,
                [name]: newConnection ? newConnection : {},
            })),
        []
    );

    console.log("current Connections", connections);

    if (!connections) {
        return <div style={{ padding: "8rem" }}>
            <Loading />
        </div>
    }

    return (
        <ConnectionsContext.Provider value={connections}>
            <ConnectionsAPIContext.Provider value={{ addConnection }}>
                {children}
            </ConnectionsAPIContext.Provider>
        </ConnectionsContext.Provider>
    );
};
