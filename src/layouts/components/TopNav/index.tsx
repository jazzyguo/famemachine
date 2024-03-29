import React from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/contexts/AuthContext";
import { LoginButton, SignupButton } from "@/components/Auth";
import UserMenuList from "../UserMenuList";

import styles from "./TopNav.module.scss";

const TopNav = () => {
    const { user } = useAuth();
    const router = useRouter();

    // don't show redundant signin/signup buttons on these pages
    const isSignupPage = ["/signup", "/signin"].includes(router?.pathname);

    return (
        <div className={styles.container}>
            <h1 onClick={() => router.push(user ? "/videos" : "/")}>
                Famemachine.ai
            </h1>
            {!user.uid ? (
                !isSignupPage && (
                    <div className={styles.loginButtons}>
                        <LoginButton />
                        <SignupButton />
                    </div>
                )
            ) : (
                <UserMenuList user={user} />
            )}
        </div>
    );
};

export default TopNav;
