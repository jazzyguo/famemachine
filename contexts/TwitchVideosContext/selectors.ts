import { createSelector } from "reselect";
import { State } from "./types";

const getVideos = (state: State) => state.videos;

export const selectVideoById = createSelector(
    getVideos,
    (_: any, id: string) => id,
    (videos, id) => videos.find((video) => video.id === id)
);
