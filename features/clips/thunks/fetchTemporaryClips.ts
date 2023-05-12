import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchTemporaryClips = createAsyncThunk<>(
    "clips/fetchTemporaryClips",
    async (id, { rejectWithValue }) => {
        return id;
    }
);

export default fetchTemporaryClips;
