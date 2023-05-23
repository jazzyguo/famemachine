import React, { useEffect } from "react";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import { GetServerSidePropsContext } from "next";
import { ATHENA_API_URL } from "@/lib/consts/api";

import withAuth from "@/components/hoc/withAuth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { query } = context;
    const { oauth_token, oauth_verifier } = query

    try {
        const url = `${ATHENA_API_URL}connect/twitter/callback`

        const response = await fetch(`${url}?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`);

        console.log(response)

        if (
            response.status !== 200
        ) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();

        return {
            props: {
                accessToken: data.access_token,
                accessTokenSecret: data.access_token_secret,
            },
        };
    } catch (e) {
        console.log("Error generating access code", e);
        return { props: {} };
    }
}

const TwitterConnectPage = ({
    accessToken,
    accessTokenSecret,
}: {
    accessToken: string;
    accessTokenSecret: string;
}) => {
    const router = useRouter();

    // useEffect(() => {
    //     if (!accessToken || !accessTokenSecret) {
    //         router.push("/");
    //     }
    // }, [accessToken, accessTokenSecret, router]);
console.log({accessToken, accessTokenSecret})
    return (
        <div>
            {accessToken}
            {accessTokenSecret}
        </div>
    );
};

export default withAuth(TwitterConnectPage);
