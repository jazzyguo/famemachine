import { State, Action } from "./types";
import { isEmpty } from "lodash";

export const localStorageKey = "famemachine_twitchVideosState";

export const initialState: State = {
    videos: [],
    loading: false,
    error: null,
    pagination: {
        cursor: null,
        isLastPage: false,
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
            const newState = {
                ...state,
                loading: false,
                videos: action.payload.videos,
                pagination: {
                    ...state.pagination,
                    cursor: action.payload.pagination.cursor,
                    isLastPage: isEmpty(action.payload.pagination),
                },
            };
            localStorage.setItem(localStorageKey, JSON.stringify(newState));
            return newState;
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
