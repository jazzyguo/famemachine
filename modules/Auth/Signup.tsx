import React, { useState } from "react";
import Link from "next/link";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import addData from "@/firebase/firestore/addData";

import LoginForm from "@/components/Auth/LoginForm";

import styles from "./Signin.module.scss";

const errorMessages = {
    "Firebase: Password should be at least 6 characters (auth/weak-password).":
        "Password should be at least 6 characters",
    "Firebase: Error (auth/email-already-in-use).": "Account already in use",
};

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signupError, setSignupError] = useState<null | string>(null);

    const router = useRouter();

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const { result, error } = await signUp(email, password);

        if (error) {
            const errorMessage = errorMessages[error?.message];
            setSignupError(errorMessage);
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
                error={signupError}
            />
            <p>{`Already have an account? `}</p>
            <Link href="/signin">Log in</Link>
        </div>
    );
};

export default React.memo(SignupPage);
