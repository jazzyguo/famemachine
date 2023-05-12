import { createSlice } from "@reduxjs/toolkit";

import { fetchSavedClips, fetchTemporaryClips } from "./thunks";

import {
    IDLE_STATUS,
    LOADING_STATUS,
    READY_STATUS,
    ERROR_STATUS,
} from "@/lib/consts/api";

export const name = "clips";

export const initialState: ClipsReducerState = {
    saved: [],
    temporary: [],
    status: IDLE_STATUS,
    error: undefined,
};

const clipsSlice = createSlice({
    name,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      
    },
});

export const clipsSliceInitialState = {
    [name]: initialState,
};

export const clipsSliceReducer = {
    [name]: clipsSlice.reducer,
};

export default clipsSlice.reducer;
