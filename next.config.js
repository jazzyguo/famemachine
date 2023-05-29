/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['vod-secure.twitch.tv', 'static-cdn.jtvnw.net', 'dummyimage.com'],
  },
  publicRuntimeConfig: {
    ATHENA_API_URL: process.env.ATHENA_API_URL,

    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,

    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_ID: process.env.FIREBASE_MESSAGING_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,

    MEDIA_URL: process.env.MEDIA_URL,
  },
}

module.exports = nextConfig
