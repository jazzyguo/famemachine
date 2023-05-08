import React, {
    ReactNode,
    useState,
    useEffect,
    createContext,
    useContext,
} from "react";
import { User, onAuthStateChanged, getAuth } from "firebase/auth";
import app from "@/firebase/config";
import Loading from "@/components/Loading";

const auth = getAuth(app);

export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    console.log("curr user", user);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? (
                <div style={{ padding: "6rem" }}>
                    <Loading />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
