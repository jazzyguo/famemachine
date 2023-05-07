/**
 *  curl -X GET 'https://api.twitch.tv/helix/videos?user_id=51496027' \
-H 'Authorization: Bearer jh0kdxp0glxwsj4f2me774tnmnrt70' \
-H 'Client-Id: l0122tzvf1hjb89yjoogivk0frglsp'
 */
import {
    useState,
    useEffect,
    createContext,
    useContext,
    ReactNode,
    useCallback,
} from "react";
import Loading from "@/components/Loading";
import getData from "@/firebase/firestore/getData";
import { useAuthContext } from "@/contexts/AuthContext";

type Connection = {
    [key: string]: string;
};

type Connections = {
    [key: string]: Connection;
};

export const ConnectionsContext = createContext<Connections>({});
export const ConnectionsAPIContext = createContext<
    (name: string, newConnection: Connection | null) => void
>(() => undefined);

export const useConnectionsContext = () => useContext(ConnectionsContext);
export const useConnectionsAPIContext = () => useContext(ConnectionsAPIContext);

export const ConnectionsContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { user } = useAuthContext();
    const [connections, setConnections] = useState<Connections>({});

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // fetch Connections from firestore
        const fetchUser = async () => {
            if (user) {
                const { error, result } = await getData("users", user.uid);

                if (error) {
                    throw new Error("Error fetching Connections");
                }

                if (result?.connections) {
                    setConnections(result.connections);
                }

                setLoading(false);
            }
        };

        try {
            fetchUser();
        } catch (e) {
            console.log(e);
            setLoading(false);
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
            <ConnectionsAPIContext.Provider value={addConnection}>
                {loading ? (
                    <div style={{ padding: "6rem" }}>
                        <Loading />
                    </div>
                ) : (
                    children
                )}
            </ConnectionsAPIContext.Provider>
        </ConnectionsContext.Provider>
    );
};
