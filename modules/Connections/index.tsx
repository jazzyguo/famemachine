import React from "react";
import ConnectionCard from "./components/ConnectionCard";

import {
    TwitchConnectButton,
    TwitchDisconnectButton,
    TwitchLogo,
} from "./components/Twitch";

import { useConnectionsContext } from "@/contexts/ConnectionsContext";

import styles from "./Connections.module.scss";

const ConnectionsModule = () => {
    const { twitch } = useConnectionsContext();

    return (
        <div className={styles.container}>
            <ConnectionCard
                Logo={TwitchLogo}
                title="Twitch"
                identifier={twitch?.user_id}
                ConnectButton={TwitchConnectButton}
                DisconnectButton={TwitchDisconnectButton}
                text="By connecting your account with your Twitch account, you
                acknowledge and agree that information you choose to share will
                be uploaded to Twitch and may be viewed by Twitch and other
                Twitch users. Also, your Twitch account information may be used
                by Twitch. Famemachine.ai will not publicly display your Twitch
                account information. If you no longer want to share this
                information, please disconnect your Twitch account."
            />
        </div>
    );
};

export default ConnectionsModule;
