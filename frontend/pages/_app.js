// frontend/pages/_app.js
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import theme from "../styles/theme";
import createEmotionCache from "../utils/createEmotionCache";
import { ClientProvider } from "../context/ClientContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { Toolbar } from "@mui/material";

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <ClientProvider>
          <CartProvider>
            <Navbar />
            <Toolbar />
            <Component {...pageProps} />
          </CartProvider>
        </ClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
