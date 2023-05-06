import React from "react";
import Link from "next/link";
import signIn from "@/firebase/auth/signin";
import { useRouter } from "next/navigation";

import LoginForm from "@/components/Auth/LoginForm";

import styles from "./Signin.module.scss";

const SigninPage = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const router = useRouter();

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const { error } = await signIn(email, password);

        if (error) {
            console.log(error);
        }

        return router.push("/");
    };

    return (
        <div className={styles.container}>
            <LoginForm
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
