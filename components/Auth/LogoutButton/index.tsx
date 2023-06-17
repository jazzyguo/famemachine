import React from "react";
import { signOut, getAuth } from "firebase/auth";
import app from "@/firebase/config";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuItem from "@mui/material/MenuItem";

import useTwitchStore from "@/stores/twitch";
import usePublishStore from "@/stores/publish";

const auth = getAuth(app);

const LogoutButton = () => {
    const twitchReset = useTwitchStore((state) => state.reset);
    const publishReset = usePublishStore((state) => state.reset)

    const handleLogout = async () => {
        try {
            twitchReset();
            publishReset()
            await signOut(auth);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <MenuItem onClick={handleLogout} disableRipple>
            <LogoutIcon />
            Logout
        </MenuItem>
    );
};

export default LogoutButton;
