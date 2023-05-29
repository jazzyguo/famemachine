# .env.local setup
NEXT_PUBLIC_PROJECT_ID=famemachine-dev
NEXT_PUBLIC_BASE_URL=http://localhost:3000

TWITCH_CLIENT_ID=''
TWITCH_CLIENT_SECRET=

FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_ID=
FIREBASE_APP_ID=

ATHENA_API_URL=http://127.0.0.1:5000/

!TODO
- security
Need to move twitch oauth connect/disconnect logic into API endpoints

Need to add bearer token logic into the API so we can pull the user_id instead of passing it in for every endpoint

Need to add an email verification system before a user can attach any social connections

Set up public media provider for saved/published clips instead of using s3 bucket (right now we move files between a temp/saved folder within s3.) this new media provider will be used to publish clips too if we choose to save a video before publishing.

- features
Need to add Infinite scrolling on the twitch videos list page

- optimize
paginate clips for temporary/saved instead of pulling all at once

Split vid processing logic to either use sockets or cloud functions / webhooks instead of an open HTTP request (think this is a must since http requests are taking minutes)
