import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const clipsApi = createApi({
    reducerPath: "clipsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/",
    }),
    endpoints: (builder) => ({}),
});
