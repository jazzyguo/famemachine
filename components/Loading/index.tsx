import React from "react";
import styles from "./Loading.module.scss";

const Loading = () => (
    <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default React.memo(Loading);
