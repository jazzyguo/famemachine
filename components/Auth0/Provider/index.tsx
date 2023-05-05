import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const Provider = ({ children }: { children: React.ReactNode }) => (
    <Auth0Provider
        domain={publicRuntimeConfig.AUTH0_DOMAIN}
        clientId={publicRuntimeConfig.AUTH0_CLIENT_ID}
        authorizationParams={{
            redirect_uri:
                typeof window !== "undefined" ? window.location.origin : "",
            audience: `https://${publicRuntimeConfig.AUTH0_DOMAIN}/api/v2/`,
        }}
    >
        {children}
    </Auth0Provider>
);

export default Provider;
