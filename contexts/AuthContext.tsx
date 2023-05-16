import React, {
    ReactNode,
    useState,
    useEffect,
    createContext,
    useContext,
} from "react";
import {
    User,
    onAuthStateChanged,
    getAuth,
    IdTokenResult,
} from "firebase/auth";
import app from "@/firebase/config";
import Loading from "@/components/Loading";

const auth = getAuth(app);

export const AuthContext = createContext<User>({
    emailVerified: false,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: "",
    tenantId: null,
    delete: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getIdToken: function (forceRefresh?: boolean | undefined): Promise<string> {
        throw new Error("Function not implemented.");
    },
    getIdTokenResult: function (
        forceRefresh?: boolean | undefined
    ): Promise<IdTokenResult> {
        throw new Error("Function not implemented.");
    },
    reload: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    toJSON: function (): object {
        throw new Error("Function not implemented.");
    },
    displayName: null,
    email: null,
    phoneNumber: null,
    photoURL: null,
    providerId: "",
    uid: "",
});

export const useAuth = () => useContext(AuthContext);

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
                <div style={{ padding: "8rem" }}>
                    <Loading />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
