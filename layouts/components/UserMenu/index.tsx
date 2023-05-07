import React from "react";
import styles from "./UserMenu.module.scss";

type Props = {
    user: {
        email: string;
    };
};

const UserMenu = ({ user }: Props) => (
    <div className={styles.userMenu}>
        <div>{user.email}</div>
    </div>
);

export default UserMenu;
