// frontend/pages/_app.js
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";  // <-- Importujemy navbar

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Navbar />  {/* <-- Globalny navbar */}
      <Component {...pageProps} />  {/* <-- Reszta aplikacji (np. Dashboard, Orders) */}
    </CartProvider>
  );
}

export default MyApp;
