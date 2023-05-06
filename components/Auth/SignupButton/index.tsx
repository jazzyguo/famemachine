import React from "react";
import { useRouter } from "next/router";
import styles from "./SignupButton.module.scss";

const LoginButton = () => {
    const router = useRouter();
    return <button onClick={() => router.push("/signup")}>Sign up</button>;
};

export default LoginButton;
