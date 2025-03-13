// frontend/pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useClient } from "../context/ClientContext";

export default function LoginPage() {
  const router = useRouter();
  const { setSelectedClient } = useClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Niepoprawne dane logowania");
      } else {
        // Zakładamy, że data zawiera np. recordId i clientName
        const clientInfo = {
          recordId: data.recordId,
          clientName: data.clientName
        };
        // Zapis w kontekście
        setSelectedClient(clientInfo);
        // Zapis w localStorage
        localStorage.setItem("selectedClient", JSON.stringify(clientInfo));
        // Przekierowanie do dashboardu
        router.push("/dashboard");
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
        Logowanie
      </Typography>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Hasło"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </form>
    </Box>
  );
}
