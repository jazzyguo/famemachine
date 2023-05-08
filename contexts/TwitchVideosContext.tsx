import React, {
    ReactNode,
    useState,
    useEffect,
    createContext,
    useContext,
} from "react";

export const TwitchVideosContext = createContext({});

export const useTwitchVideosContext = () => useContext(TwitchVideosContext);

/**
 * Provides videos state fetched from twitch.
 * 
 * Used in modules/Videos/index.tsx
 */
export const TwitchVideosContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    return (
        <TwitchVideosContext.Provider value={{}}>
            {children}
        </TwitchVideosContext.Provider>
    );
};
