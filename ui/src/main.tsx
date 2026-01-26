import ReactDOM from 'react-dom/client';
import App from "./App"
import "./index.css";
import {StrictMode, Suspense} from "react";
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, CssBaseline } from "@mui/material";
import {CONFIG} from "./config-global.ts";
import theme from "./theme";


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <StrictMode>
        <HelmetProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter basename={CONFIG.site.basePath}>
                    <Suspense>
                        <App />
                    </Suspense>
                </BrowserRouter>
            </ThemeProvider>
        </HelmetProvider>
    </StrictMode>
);
