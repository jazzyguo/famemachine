import React from "react";
import { useRouter } from "next/router";
import styles from "./SignupButton.module.scss";

const SignupButton = () => {
    const router = useRouter();
    return <button onClick={() => router.push("/signup")}>Sign up</button>;
};

export default React.memo(SignupButton);
