App that allows users to connect their twitch and twitter accounts.

These connections allow the user to pull their twitch vods and be able to process them into highlights from an algorithm that uses average decibel levels (private repo). These clips can then be saved and published to Twitter.

Google firebase auth is used to manage profiles. Firestore is used to manage user connections as well as user clips that are saved/published.

S3 is used to store clips that are generated - these clips are pruned after a day if they are not saved. Saved clips are stored permenantely in S3 unless they are unsaved. 

Built using typescript / nextjs / react-query / zustand 

Live app at https://famemachineai-git-main-jazzy.vercel.app/

# .env.local setup
```
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

```
!TODO
- security
Need to move twitch oauth connect/disconnect logic into API endpoints 

Need to add an email verification system before a user can attach any social connections
 
- optimize
paginate clips for temporary/saved instead of pulling all at once

Split vid processing logic to either use sockets or cloud functions / webhooks instead of an open HTTP request (think this is a must since http requests are taking minutes). 
