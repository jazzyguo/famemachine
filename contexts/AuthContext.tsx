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
import useClipsStore from "@/stores/clips";
import Loading from "@/components/Loading";
import { getTimeDiffInSeconds } from "@/lib/utils/date";

const auth = getAuth(app);

const initialState = {
    user: {
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
    }
}

export const AuthContext = createContext<{ user: User }>(initialState);

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(initialState.user);
    const [loading, setLoading] = useState<boolean>(true);

    console.log("curr user", user);

    const lastTimeFetchedTemp = useClipsStore((state) => state.lastTimeFetchedTemp)

    const getTemporaryClips = useClipsStore((state) => state.getTemporaryClips);
    const getSavedClips = useClipsStore((state) => state.getSavedClips);

    const postLoginActions = (userId: string) => {
        // fetch user clips - saved/temporary
        // we fetch them here because this will run on every page refresh / login
        // which allows us to bust the cache on potentially expired temp
        const timeDiffBetweenLastFetched = getTimeDiffInSeconds(lastTimeFetchedTemp)

        if (timeDiffBetweenLastFetched >= 86400 || !lastTimeFetchedTemp) {
            getTemporaryClips({ userId, reset: true });
            getSavedClips(userId);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (_user) => {
            if (_user?.uid) {
                setUser(_user);
                postLoginActions(_user.uid);
            } else {
                setUser(initialState.user);
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
