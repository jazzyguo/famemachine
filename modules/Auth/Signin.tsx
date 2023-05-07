import React, { useState } from "react";
import Link from "next/link";
import signIn from "@/firebase/auth/signin";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/components/Auth";

import styles from "./Signin.module.scss";

const SigninPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);

    const router = useRouter();

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const { error } = await signIn(email, password);

        if (error) {
            console.log(error);
            setLoginError("Account not found");
        } else {
            return router.push("/");
        }
    };

    return (
        <div className={styles.container}>
            <LoginForm
                error={loginError}
                onSubmit={onSubmit}
                setEmail={setEmail}
                setPassword={setPassword}
            />
            <p>{`Don't have an account?`}</p>
            <Link href="/signup">Sign up</Link>
        </div>
    );
};

export default React.memo(SigninPage);
