import React from "react";
import {
    TwitchDisconnectButton,
    TwitchConnectButton,
} from "./components/Twitch";
import { useAuthContext } from "@/contexts/AuthContext";
import { useConnectionsContext } from "@/contexts/ConnectionsContext";

import styles from "./Connections.module.scss";

const ConnectionsModule = () => {
    const { user } = useAuthContext();
    const { twitch } = useConnectionsContext();

    return (
        <div>
            {!twitch && <TwitchConnectButton />}
            {twitch && <TwitchDisconnectButton />}
        </div>
    );
};

export default ConnectionsModule;
