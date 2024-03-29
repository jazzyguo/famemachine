import { ReactNode } from "react";
import Head from "next/head";
import TopNav from "../components/TopNav";
import { Roboto } from "next/font/google";
import styles from "./App.module.scss";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
});

const AppLayout = ({ children }: { children: ReactNode }) => (
    <>
        <Head>
            <title>Famemachine.ai</title>
            <meta name="description" content="" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={`${styles.main} ${roboto.className}`}>
            <TopNav />
            <div className={styles.main_content}>
                {children}
            </div>
        </main>
    </>
);

export default AppLayout;
