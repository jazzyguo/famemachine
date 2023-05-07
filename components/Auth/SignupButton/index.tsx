import React from "react";
import { useRouter } from "next/router";

const SignupButton = () => {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push("/signup")}
        >
            Sign up
        </button>
    );
};

export default SignupButton;
