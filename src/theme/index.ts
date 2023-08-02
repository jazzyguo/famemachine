import { createTheme } from '@mui/material/styles';

const components = {
    MuiButton: {
        styleOverrides: {
            root: {
                fontWeight: 'bold',
            },
        },
    },
    MuiTab: {
        styleOverrides: {
            root: {
                fontWeight: 'bold',
            },
        },
    },
};

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    components,
});
