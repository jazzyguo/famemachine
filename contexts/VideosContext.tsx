import React, {
    ReactNode,
    useState,
    useEffect,
    createContext,
    useContext,
} from "react";

export const VideosContext = createContext({});

export const useVideosContext = () => useContext(VideosContext);

/**
 * Provides videos state fetched from social medias.
 * Also will provide state of a selected video that is selected for processing
 * As well as clips generated
 */
export const VideosContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    return (
        <VideosContext.Provider value={{}}>{children}</VideosContext.Provider>
    );
};
