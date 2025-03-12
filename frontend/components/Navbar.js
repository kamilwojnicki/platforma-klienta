// frontend/components/Navbar.js
import { AppBar, Toolbar, Box, Button, Badge } from "@mui/material";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../context/CartContext";
import { useClient } from "../context/ClientContext";

export default function Navbar() {
  const { cart } = useCart();
  const { selectedClient } = useClient();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ minHeight: "56px", px: 2 }}>
        {/* Logo */}
        <Link href="/" passHref legacyBehavior>
          <Box
            component="img"
            src="https://powercanvas.pl/img/logoPC.svg"
            alt="Power Canvas Logo"
            sx={{
              height: 40,
              cursor: "pointer",
              marginRight: 2,
            }}
          />
        </Link>

        {/* Link do /dashboard */}
        <Link href="/dashboard" passHref legacyBehavior>
          <Button color="inherit" sx={{ textTransform: "none", mr: 2 }}>
            Dashboard
          </Button>
        </Link>

        {/* Link do „Historia zamówień” → /dashboard/history?client=... TYLKO jeśli selectedClient nie jest nullem */}
        {selectedClient && (
          <Link
            href={`/dashboard/history?client=${encodeURIComponent(
              selectedClient
            )}`}
            passHref
            legacyBehavior
          >
            <Button color="inherit" sx={{ textTransform: "none", mr: 2 }}>
              Historia zamówień
            </Button>
          </Link>
        )}

        {/* „Elastyczna” przestrzeń */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Koszyk */}
        <Link href="/cart" passHref legacyBehavior>
          <Button color="inherit" sx={{ textTransform: "none" }}>
            <Badge
              badgeContent={cart.length}
              color="error"
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{ mr: 1 }}
            >
              <ShoppingCartIcon />
            </Badge>
            Koszyk
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
