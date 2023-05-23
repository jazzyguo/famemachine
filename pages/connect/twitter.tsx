import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import { ATHENA_API_URL } from "@/lib/consts/api";
import { useAuth } from "@/contexts/AuthContext";
import {
    useConnectionsAPI,
} from "@/contexts/ConnectionsContext";

import Loading from "@/components/Loading";

import withAuth from "@/components/hoc/withAuth";

const TwitterConnectPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { addConnection } = useConnectionsAPI();

    const { oauth_token, oauth_verifier } = router?.query || {}

    const handleTwitterAuth = useCallback(async () => {
        if (oauth_token && oauth_verifier && user.uid) {
            try {
                const url = `${ATHENA_API_URL}connect/twitter/callback`

                const response = await fetch(`${url}?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}&user_id=${user.uid}`);

                if (
                    response.status !== 200
                ) {
                    throw new Error(`Server Error: ${response.status}`);
                }

                // api sets the connection info in firestore
                const {
                    access_token,
                    access_token_secret,
                    screen_name,
                } = await response.json();

                // set the local connections state on clientside
                addConnection("twitter", {
                    access_token,
                    access_token_secret,
                    screen_name,
                });
            } catch (e) {
                console.log("Error generating access code", e);
            }

            router.push('/connections')
        }
    }, [oauth_token, oauth_verifier, user.uid])

    useEffect(() => {
        handleTwitterAuth()
    }, [handleTwitterAuth])

    return <Loading />
};

export default withAuth(TwitterConnectPage);
