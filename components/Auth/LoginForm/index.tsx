import React from "react";

import styles from "./LoginForm.module.scss";

type Props = {
    setPassword: (password: string) => void;
    setEmail: (email: string) => void;
    onSubmit: (event: React.SyntheticEvent) => void;
    type?: "signup" | "signin";
    error?: null | string;
};

const LoginForm = ({
    type = "signin",
    setPassword,
    setEmail,
    onSubmit,
    error,
}: Props) => {
    const text = type === "signin" ? "Sign in" : "Sign up";
    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <h1>{text}</h1>
            <label htmlFor="email">
                <p>Email</p>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    name="email"
                    id="email"
                    placeholder="example@mail.com"
                />
            </label>
            <label htmlFor="password">
                <p>Password</p>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    name="password"
                    id="password"
                    placeholder="password"
                />
            </label>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit">{text}</button>
        </form>
    );
};

export default React.memo(LoginForm);
