import React from "react";
import SignupModule from "@/modules/Signup";
import { Inter } from "next/font/google";

import styles from "@/styles/Index.module.scss";

const inter = Inter({ subsets: ["latin"] });

const SignupPage = () => (
    <main className={`${styles.main} ${inter.className}`}>
        <SignupModule />
    </main>
);

export default SignupPage;
