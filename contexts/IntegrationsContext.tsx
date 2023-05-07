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

type Integration = {
    [key: string]: string;
};

type Integrations = {
    [key: string]: Integration;
};

export const IntegrationsContext = createContext<Integrations>({});
export const IntegrationsAPIContext = createContext<
    (name: string, newIntegration: Integration) => void
>(() => undefined);

export const useIntegrationsContext = () => useContext(IntegrationsContext);
export const useIntegrationsAPIContext = () =>
    useContext(IntegrationsAPIContext);

export const IntegrationsContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { user } = useAuthContext();
    const [integrations, setIntegrations] = useState<Integrations>({});

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // fetch integrations from firestore
        const fetchUser = async () => {
            if (user) {
                const { error, result } = await getData("users", user.uid);

                if (error) {
                    throw new Error("Error fetching integrations");
                }

                if (result?.integrations) {
                    setIntegrations(result.integrations);
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

    const addIntegration = useCallback(
        (name: string, newIntegration: Integration) =>
            setIntegrations((prevState) => ({
                ...prevState,
                [name]: newIntegration,
            })),
        []
    );

    console.log("current integrations", integrations);

    return (
        <IntegrationsContext.Provider value={integrations}>
            <IntegrationsAPIContext.Provider value={addIntegration}>
                {loading ? (
                    <div style={{ padding: "6rem" }}>
                        <Loading />
                    </div>
                ) : (
                    children
                )}
            </IntegrationsAPIContext.Provider>
        </IntegrationsContext.Provider>
    );
};
