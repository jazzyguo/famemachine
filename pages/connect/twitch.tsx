import React, { useEffect } from "react";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import { GetServerSidePropsContext } from "next";

import { TWITCH_API_AUTH_URL } from "@/utils/consts/api";
import TwitchConnectModule from "@/modules/Twitch/Connect";
import withAuth from "@/components/hoc/withAuth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { query } = context;
    const code = query.code;

    try {
        const response = await fetch(`${TWITCH_API_AUTH_URL}/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                grant_type: "authorization_code",
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/connect/twitch`,
            }),
        });

        const data = await response.json();

        if (
            response.status !== 200 ||
            !data?.access_token ||
            !data?.refresh_token
        ) {
            throw new Error("Invalid authorization");
        }

        return {
            props: {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
            },
        };
    } catch (e) {
        console.log("Error generating access code", e);
        return { props: {} };
    }
}

const TwitchConnectPage = ({
    accessToken,
    refreshToken,
}: {
    accessToken: string;
    refreshToken: string;
}) => {
    const router = useRouter();

    useEffect(() => {
        if (!accessToken || !refreshToken) {
            router.push("/");
        }
    }, [accessToken, refreshToken, router]);

    return (
        <TwitchConnectModule
            accessToken={accessToken}
            refreshToken={refreshToken}
        />
    );
};

export default withAuth(TwitchConnectPage);
