type ClipsReducerState = {
    saved: string[];
    temporary: string[];
    status: "idle" | "loading" | "ready" | "error";
    error: string | undefined;
};
