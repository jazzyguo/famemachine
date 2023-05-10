import React, {
    ReactNode,
    useState,
    useEffect,
    createContext,
    useContext,
    useMemo,
} from "react";

export const VideosContext = createContext({});

export const useVideosContext = () => useContext(VideosContext);

/**
 * provides state of a selected video that is selected for processing
 * As well as clips generated
 *
 * Used in pages/videos.tsx
 */
export const VideosContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const memoValue = useMemo(() => ({}), []);

    return (
        <VideosContext.Provider value={memoValue}>
            {children}
        </VideosContext.Provider>
    );
};
