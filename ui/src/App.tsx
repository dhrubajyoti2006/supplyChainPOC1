// import {AuthProvider} from "./auth/context/firebase";
import {Router} from "./routes/sections";

export default function App() {
    // useScrollToTop();

    return (
        // <AuthProvider>
        //     <SettingsProvider settings={defaultSettings}>
        //     <ThemeProvider>
        //     <MotionLazy>
        //     <ProgressBar />
        //     <SettingsDrawer />
        //     <Snackbar />
        //     <Router />
        //     </MotionLazy>
        //     </ThemeProvider>
        //     </SettingsProvider>
        // </AuthProvider>
        <Router/>
    );
}
