import { ReactNode } from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { darkTheme } from "@/theme";

const StyleProvider = ({ children }: { children: ReactNode }) => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    </StyledEngineProvider>
);

export default StyleProvider;
