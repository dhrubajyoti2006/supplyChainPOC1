import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes/sections";

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  )
}

export default App
