import React from "react";

import styles from "./LoginForm.module.scss";

type Props = {
    setPassword: (password: string) => void;
    setEmail: (email: string) => void;
    onSubmit: (event: React.SyntheticEvent) => void;
};

const LoginForm = ({ setPassword, setEmail, onSubmit }: Props) => (
    <form onSubmit={onSubmit} className={styles.form}>
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
        <button type="submit">Sign In</button>
    </form>
);

export default React.memo(LoginForm);
