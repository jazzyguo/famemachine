import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ATHENA_API_URL } from "@/lib/consts/api";

const clipsApi = createApi({
    reducerPath: "clipsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ATHENA_API_URL,
    }),
    endpoints: (builder) => ({
        getSavedClips: builder.query<string[], string>({
            query: (user_id) => ({
                url: "clips/saved",
                method: "get",
                params: {
                    user_id,
                },
            }),
        }),
        getTemporaryClips: builder.query<string[], string>({
            query: (user_id) => ({
                url: "clips/temporary",
                method: "get",
                params: {
                    user_id,
                },
            }),
        }),
    }),
});

export const { useGetSavedClipsQuery, useGetTemporaryClipsQuery } = clipsApi;

export default clipsApi;
