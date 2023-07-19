import Axios, { InternalAxiosRequestConfig } from 'axios';
import { getAuth } from "firebase/auth";
import app from "@/firebase/config";
import { ATHENA_API_URL } from "@/lib/consts/api";

const auth = getAuth(app);

const authRequestInterceptor = (config: InternalAxiosRequestConfig<any>) => {
    // @ts-ignore
    const token = auth?.currentUser?.accessToken
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    config.headers.Accept = 'application/json';
    return config;
}

const axios = Axios.create({
    baseURL: ATHENA_API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;
