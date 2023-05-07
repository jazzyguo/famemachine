import React, { useEffect } from "react";
import TwitchConnectModule from "@/modules/TwitchConnect";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { query } = context;
    const code = query.code;

    try {
        const response = await fetch("https://id.twitch.tv/oauth2/token", {
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

        if (response.status !== 200 || !data?.access_token) {
            throw new Error("Invalid authorization");
        }

        return { props: { accessToken: data.access_token } };
    } catch (e) {
        console.log("Error generating access code", e);
        return { props: {} };
    }
}

const TwitchConnectPage = ({ accessToken }: { accessToken: string }) => {
    const router = useRouter();

    useEffect(() => {
        if (!accessToken) {
            router.push("/");
        }
    }, [accessToken, router]);

    return <TwitchConnectModule accessToken={accessToken} />;
};

export default TwitchConnectPage;
