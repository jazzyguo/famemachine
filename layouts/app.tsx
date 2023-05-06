import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/App.module.scss";

const inter = Inter({ subsets: ["latin"] });

const AppLayout = ({ children }: { children: React.ReactNode }) => (
    <>
        <Head>
            <title>Famemachine.ai</title>
            <meta name="description" content="Generated by create next app" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={`${styles.main} ${inter.className}`}>{children}</main>
    </>
);

export default AppLayout;
