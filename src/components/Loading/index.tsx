import React from "react";
import cx from "classnames";
import styles from "./Loading.module.scss";

const Loading = ({ className }: { className?: string }) => (
    <div className={cx(className, styles.spinner)}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default Loading;
