import React from "react";
import Link from "next/link";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import addData from "@/firebase/firestore/addData";

import LoginForm from "@/components/Auth/LoginForm";

import styles from "./Signin.module.scss";

const SignupPage = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const router = useRouter();

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const { result, error } = await signUp(email, password);

        if (error) {
            return console.log(error);
        }

        const { user } = result;

        await addData("users", user.uid, {
            email: user.email,
        });

        return router.push("/");
    };

    return (
        <div className={styles.container}>
            <LoginForm
                onSubmit={onSubmit}
                setEmail={setEmail}
                setPassword={setPassword}
                type="signup"
            />
            <p>{`Already have an account? `}</p>
            <Link href="/signin">Log in</Link>
        </div>
    );
};

export default React.memo(SignupPage);
