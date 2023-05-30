import React from "react";
import Link from 'next/link'

import { PUBLISH_CONNECTIONS } from "@/lib/consts/publish";
import { firstLetterToUppercase } from "@/lib/utils/strings";

import styles from "./NoConnections.module.scss";

const NoConnections = () =>
    <div className={styles.noConnections}>
        Please
        <Link href="/connections"> connect </Link>
        {`one of the following socials to publish a clip: `}
        {PUBLISH_CONNECTIONS.map((connection: string, idx) =>
            <span key={`no-connection-${idx}`}>
                {firstLetterToUppercase(connection)}{idx + 1 < PUBLISH_CONNECTIONS.length ? ', ' : ''}
            </span>

        )}
    </div>

export default NoConnections;
