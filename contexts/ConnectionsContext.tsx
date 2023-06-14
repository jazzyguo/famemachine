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

type Connection = {
    [key: string]: string;
};

type Connections = {
    [key: string]: Connection | null;
};

export const ConnectionsContext = createContext<Connections>({});
export const ConnectionsAPIContext = createContext<{
    addConnection: (name: string, newConnection: Connection | null) => void;
}>({ addConnection: () => undefined });

export const useConnections = () => useContext(ConnectionsContext);
export const useConnectionsAPI = () => useContext(ConnectionsAPIContext);

export const ConnectionsContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { user } = useAuth();
    const [connections, setConnections] = useState<Connections>({});

    useEffect(() => {
        // fetch Connections from firestore
        const fetchUser = async () => {
            if (user.uid) {
                const { error, result } = await getData("users", user.uid);

                if (error) {
                    throw new Error("Error fetching Connections");
                }

                if (result?.connections) {
                    setConnections(result.connections);
                }
            } else {
                setConnections({})
            }
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
                [name]: newConnection,
            })),
        []
    );

    console.log("current Connections", connections);

    return (
        <ConnectionsContext.Provider value={connections}>
            <ConnectionsAPIContext.Provider value={{ addConnection }}>
                {children}
            </ConnectionsAPIContext.Provider>
        </ConnectionsContext.Provider>
    );
};
