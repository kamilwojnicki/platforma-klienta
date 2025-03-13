// frontend/components/Navbar.js
import { AppBar, Toolbar, Box, Button, Badge, Typography } from "@mui/material";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../context/CartContext";
import { useClient } from "../context/ClientContext";

export default function Navbar() {
  const { cart } = useCart();
  const { selectedClient } = useClient(); // obiekt { recordId, clientName }

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

        {/* Link do historia zamówień */}
        {selectedClient && (
          <Link
            href={`/dashboard/history?client=${encodeURIComponent(selectedClient.recordId)}`}
            passHref
            legacyBehavior
          >
            <Button color="inherit" sx={{ textTransform: "none", mr: 2 }}>
              Historia zamówień
            </Button>
          </Link>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Informacja o zalogowanym kliencie */}
        {selectedClient && (
          <Typography variant="body1" sx={{ mr: 2 }}>
            Zalogowany jako: {selectedClient.clientName}
          </Typography>
        )}

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
