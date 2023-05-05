# https local setup needed to be able to bypass user consents for auth0 social integrations

# Gen local ssl keys
https://github.com/FiloSottile/mkcert
mkcert famemachine.ai famemachine.dev.ai localhost 127.0.0.1 ::1 

# ENV 
AUTH0_CLIENT_ID=''
AUTH0_DOMAIN=dev-''
AUTH0_REDIRECT=https://famemachine.dev.ai:3000

TWITCH_CLIENT_ID=''
TWITCH_CLIENT_SECRET=''

AUTH0_CLIENT_ID=1PYfRAaQWh1GyA3sakbX8RUz70T8NXcC
AUTH0_CLIENT_SECRET=ARbAzidKCR4x4WW7SsVsHdMjCoJDplO_EtFec4deL1_IEoPaJT1puIsRHlYpVUS4
AUTH0_DOMAIN=dev-t8uuzwcl263tl5el.us.auth0.com
AUTH0_REDIRECT=https://famemachine.dev.ai:3000

TWITCH_CLIENT_ID=l0122tzvf1hjb89yjoogivk0frglsp
TWITCH_CLIENT_SECRET=ybsoi15c38nme5jizljldq9b5zwyq9