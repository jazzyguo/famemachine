import React, { ReactNode } from "react";
import cx from 'classnames'

import styles from "./Card.module.scss";

type Props = {
    className?: string;
    children: ReactNode;
    onClick?: (any: any) => any
};

const Card = ({
    className = '',
    children,
    onClick,
}: Props) => (
    <div className={cx(styles.card, className)} onClick={onClick}>
        {children}
    </div>
);

export default Card;
