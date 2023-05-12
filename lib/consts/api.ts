import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const TWITCH_API_AUTH_URL = "https://id.twitch.tv/oauth2";
export const TWITCH_API_URL = "https://api.twitch.tv/helix";

export const ATHENA_API_URL = publicRuntimeConfig.ATHENA_API_URL;

export const IDLE_STATUS = 'idle'
export const LOADING_STATUS = 'loading'
export const READY_STATUS = 'ready'
export const ERROR_STATUS = 'error'
