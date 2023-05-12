import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from "@/lib/consts/config";
import { TWITCH_API_AUTH_URL } from "@/lib/consts/api";

import addData from "@/firebase/firestore/addData";

const refreshAccessToken = async ({
    userId,
    refreshToken,
    addConnection,
}: RefreshTokenActionProps): Promise<{
    access_token?: string;
    refresh_token?: string;
    user_id?: string;
}> => {
    try {
        const url = `${TWITCH_API_AUTH_URL}/token`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                grant_type: "refresh_token",
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                refresh_token: refreshToken,
            }),
        });

        const data = await response.json();

        if (data.access_token) {
            // update the access_token and refresh_token in the connections context,
            // as well as firestore
            const twitchConnection = {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
            };

            const { error } = await addData("users", userId, {
                connections: {
                    twitch: twitchConnection,
                },
            });

            if (error) {
                console.log(error);
                throw new Error("Error setting twitch link");
            } else {
                addConnection("twitch", twitchConnection);

                return twitchConnection;
            }
        } else {
            throw new Error("Error refreshing access token");
        }
    } catch (error) {
        console.error("Error refreshing access token: ", error);
        return {};
    }
};

export default refreshAccessToken;
