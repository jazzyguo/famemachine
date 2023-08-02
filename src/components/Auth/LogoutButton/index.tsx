import React from "react";
import { useQueryClient } from '@tanstack/react-query';
import { signOut, getAuth } from "firebase/auth";
import app from "@/firebase/config";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuItem from "@mui/material/MenuItem";

import usePublishStore from "@/stores/publish";

const auth = getAuth(app);

const LogoutButton = () => {
    const queryClient = useQueryClient();

    const publishReset = usePublishStore((state) => state.reset)

    const handleLogout = async () => {
        try {
            publishReset()
            await signOut(auth);
            queryClient.clear();
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
