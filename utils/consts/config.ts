import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const TWITCH_CLIENT_ID = publicRuntimeConfig.TWITCH_CLIENT_ID;
export const TWITCH_CLIENT_SECRET = publicRuntimeConfig.TWITCH_CLIENT_SECRET;

export const FIREBASE_API_KEY = publicRuntimeConfig.FIREBASE_API_KEY;
export const FIREBASE_AUTH_DOMAIN = publicRuntimeConfig.FIREBASE_AUTH_DOMAIN;
export const FIREBASE_STORAGE_BUCKET =
    publicRuntimeConfig.FIREBASE_STORAGE_BUCKET;
export const FIREBASE_MESSAGING_ID = publicRuntimeConfig.FIREBASE_MESSAGING_ID;
export const FIREBASE_APP_ID = publicRuntimeConfig.FIREBASE_APP_ID;
