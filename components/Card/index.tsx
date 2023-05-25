import React, { ReactNode } from "react";
import cx from 'classnames'

import styles from "./Card.module.scss";

type Props = {
    className?: string;
    children: ReactNode;
};

const Card = ({
    className = '',
    children,
}: Props) => (
    <div className={cx(styles.card, className)}>
        {children}
    </div>
);

export default Card;
