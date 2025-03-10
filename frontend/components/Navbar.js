// frontend/components/Navbar.js
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav style={styles.navbar}>
      <h2>Power Canvas</h2>
      <Link href="/cart" style={styles.cartLink}>
        🛒 Koszyk <span style={styles.badge}>{cart.length}</span>
      </Link>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#f8f8f8",
  },
  cartLink: {
    textDecoration: "none",
    fontSize: "18px",
  },
  badge: {
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "4px 8px",
    marginLeft: "5px",
  },
};
