import React from "react";
import SigninModule from "@/modules/Signin";
import { Inter } from "next/font/google";

import styles from "@/styles/Index.module.scss";

const inter = Inter({ subsets: ["latin"] });

const SigninPage = () => (
    <main className={`${styles.main} ${inter.className}`}>
        <SigninModule />
    </main>
);

export default SigninPage;
