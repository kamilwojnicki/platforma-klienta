// frontend/pages/_app.js
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import theme from "../styles/theme";
import createEmotionCache from "../utils/createEmotionCache";
import { CartProvider } from "../context/CartContext";
import { ClientProvider } from "../context/ClientContext";
import Navbar from "../components/Navbar";
import { Toolbar } from "@mui/material";

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CartProvider>
          <ClientProvider>
            <Navbar />
            <Toolbar />
            <Component {...pageProps} />
          </ClientProvider>
        </CartProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
