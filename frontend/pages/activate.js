// frontend/pages/activate.js
import { useRouter } from "next/router";
import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

export default function ActivatePage() {
  const router = useRouter();
  const { token, id, client } = router.query; // token, record ID, client

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Prosta walidacja haseł
    if (password !== confirmPassword) {
      setErrorMsg("Hasła muszą być takie same.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          recordId: id,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Wystąpił błąd podczas aktywacji.");
      } else {
        setSuccessMsg("Konto zostało aktywowane. Zostaniesz przekierowany do logowania...");
        // Po kilku sekundach przekieruj na stronę logowania (np. /login)
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Błąd sieciowy. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Aktywacja konta
      </Typography>
      {client && (
        <Typography variant="subtitle1" align="center">
          Klient: {client}
        </Typography>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nowe hasło"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Powtórz hasło"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Aktywacja..." : "Aktywuj konto"}
        </Button>
      </form>
    </Box>
  );
}
