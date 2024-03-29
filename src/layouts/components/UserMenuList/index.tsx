import React, { memo } from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import LinkIcon from "@mui/icons-material/Link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import MovieIcon from '@mui/icons-material/Movie';
import {
    User,
} from "firebase/auth";
import { LogoutButton } from "@/components/Auth";

import styles from "./UserMenu.module.scss";

type Props = {
    user: User
};

const UserMenuList = ({ user }: Props) => {
    const router = useRouter();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                className={styles.menuButton}
            >
                {user.email}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                className={styles.menu}
                disableScrollLock
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                {/* <MenuItem
                    onClick={() => {
                        router.push("/file-processor");
                        handleClose();
                    }}
                    disableRipple
                >
                    <FileUploadIcon />
                    File Processor
                </MenuItem> */}
                <MenuItem
                    onClick={() => {
                        router.push("/clips/temporary");
                        handleClose();
                    }}
                    disableRipple
                >
                    <MovieIcon />
                    Clips Library
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        router.push("/videos");
                        handleClose();
                    }}
                    disableRipple
                >
                    <VideoLibraryIcon />
                    Video Library
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        router.push("/connections");
                        handleClose();
                    }}
                    disableRipple
                >
                    <LinkIcon />
                    Connections
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <LogoutButton />
            </Menu>
        </div>
    );
};

export default memo(UserMenuList);
