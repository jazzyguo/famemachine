import React, {
    ReactNode,
    useState,
    useEffect,
    createContext,
    useContext,
    useMemo,
} from "react";

export const ClipsContext = createContext({});

export const useClipsContext = () => useContext(ClipsContext);

/**
 * provides state of a selected video that is selected for processing
 * As well as clips generated
 */
export const ClipsContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const memoValue = useMemo(() => ({}), []);

    return (
        <ClipsContext.Provider value={memoValue}>
            {children}
        </ClipsContext.Provider>
    );
};
