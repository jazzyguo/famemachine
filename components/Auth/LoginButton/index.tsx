import React from "react";
import { useRouter } from "next/router";

const LoginButton = () => {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push("/signin")}
        >
            Sign In
        </button>
    );
};

export default LoginButton;
