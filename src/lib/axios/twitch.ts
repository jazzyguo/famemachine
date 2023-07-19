import Axios, { InternalAxiosRequestConfig } from 'axios';
import { TWITCH_API_URL } from "@/lib/consts/api";
import { TWITCH_CLIENT_ID } from "@/lib/consts/config";

const authRequestInterceptor = (config: InternalAxiosRequestConfig<any>) => {
    config.headers.Accept = 'application/json';
    config.headers["Client-Id"] = TWITCH_CLIENT_ID

    return config;
}

const axios = Axios.create({
    baseURL: TWITCH_API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            return { status: 401 }
        } else {
            return Promise.reject(error);
        }
    }
);

export default axios;
