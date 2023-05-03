import React from "react";
import FileUploader from "@/components/FileUploader";
import styles from "./Home.module.scss";

const HomeModule = () => (
    <div className={styles.container}>
        <FileUploader />
    </div>
);
export default HomeModule;
