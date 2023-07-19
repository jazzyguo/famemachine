import React, { ComponentType, memo } from "react";
import Card from "@/components/Card";

import styles from "./ConnectionCard.module.scss";

type Props = {
    Logo: ComponentType;
    title: string;
    identifier: string;
    text: string;
    ConnectButton: ComponentType;
    DisconnectButton: ComponentType;
};
const ConnectionCard = ({
    Logo,
    title,
    identifier,
    text,
    ConnectButton,
    DisconnectButton,
}: Props) => (
    <Card className={styles.card}>
        <Logo />
        <div>
            <p className={styles.title}>{title}</p>
            {identifier && (
                <p className={styles.id}>Account ID: {identifier}</p>
            )}
            <p className={styles.desc}>{text}</p>
        </div>
        <div className={styles.button}>
            {!identifier && <ConnectButton />}
            {identifier && <DisconnectButton />}
        </div>
    </Card>
);

export default memo(ConnectionCard);
