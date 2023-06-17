import { ReactNode } from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const StyleProvider = ({ children }: { children: ReactNode }) => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    </StyledEngineProvider>
);

export default StyleProvider;
