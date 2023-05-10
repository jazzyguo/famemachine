import { State, Action } from "./types";

export const initialState: State = {
    videos: [],
    loading: false,
    error: null,
    pagination: {
        cursor: null,
    },
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "FETCH_VIDEOS_REQUEST":
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "FETCH_VIDEOS_SUCCESS":
            return {
                ...state,
                loading: false,
                videos: action.payload.videos,
                pagination: {
                    ...state.pagination,
                    cursor: action.payload.pagination.cursor,
                },
            };
        case "FETCH_VIDEOS_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        default:
            return state;
    }
};

export default reducer;
