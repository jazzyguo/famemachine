import React from "react";
import ConnectionCard from "./components/ConnectionCard";

import {
    TwitchConnectButton,
    TwitchDisconnectButton,
    TwitchLogo,
} from "./components/Twitch";

import {
    TwitterConnectButton,
    TwitterDisconnectButton,
    TwitterLogo,
} from './components/Twitter'

import { useConnections } from "@/contexts/ConnectionsContext";

import styles from "./Connections.module.scss";

const ConnectionsModule = () => {
    const { twitch, twitter } = useConnections();

    return (
        <div className={styles.container}>
            <ConnectionCard
                Logo={TwitchLogo}
                title="Twitch"
                identifier={twitch?.user_id}
                ConnectButton={TwitchConnectButton}
                DisconnectButton={TwitchDisconnectButton}
                text="By connecting your account with your Twitch account, you
                acknowledge and agree that your Twitch account information may be used
                by Famemachine.ai. Famemachine.ai will not publicly display your Twitch
                account information. If you no longer want to share this
                information, please disconnect your Twitch account."
            />
            <ConnectionCard
                Logo={TwitterLogo}
                title="Twitter"
                identifier={twitter?.user_id}
                ConnectButton={TwitterConnectButton}
                DisconnectButton={TwitterDisconnectButton}
                text="By connecting your account with your Twitter account, you acknowledge and agree that information you choose to share will be uploaded to Twitter and may be viewed by Twitter and other Twitter users. Also, your Twitter account information may be used by Twitch. Twitch will not publicly display your Twitter account information. If you no longer want to share this information, please disconnect your Twitter account.
                "
            />
        </div>
    );
};

export default ConnectionsModule;
