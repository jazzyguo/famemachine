import { combineReducers } from "@reduxjs/toolkit";
import clipsApi from "@/api/clips";

const rootReducer = combineReducers({
    [clipsApi.reducerPath]: clipsApi.reducer,
});

export default rootReducer;
