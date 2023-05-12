import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchSavedClips = createAsyncThunk<>(
    "clips/fetchSavedClips",
    async (id, { rejectWithValue }) => {
        return id;
    }
);

export default fetchSavedClips;
