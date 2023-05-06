import React from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import addData from "@/firebase/firestore/addData";

import LoginForm from "@/components/Auth/LoginForm";

import styles from "./Signup.module.scss";

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
        <div className="wrapper">
            <h1>Sign Up</h1>
            <LoginForm
                onSubmit={onSubmit}
                setEmail={setEmail}
                setPassword={setPassword}
            />
        </div>
    );
};

export default React.memo(SignupPage);
