// frontend/pages/api/login.js
import Airtable from "airtable";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const base = new Airtable({
    apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
  }).base(process.env.AIRTABLE_BASE_ID);

  // Wyszukujemy rekord w tabeli "Klienci" po polu "Email"
  const filterFormula = `{Email} = "${email}"`;
  let records = [];
  try {
    records = await base("Klienci")
      .select({
        filterByFormula: filterFormula,
        maxRecords: 1,
      })
      .all();
  } catch (err) {
    console.error("Błąd pobierania z Airtable:", err);
    return res.status(500).json({ error: "Airtable error" });
  }

  if (records.length === 0) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const record = records[0];
  const fields = record.fields;

  // Sprawdzenie statusu konta
  if (fields["Status konta"] !== "Aktywne") {
    return res.status(403).json({ error: "Account not active" });
  }

  // Pobieramy zahashowane hasło z Airtable
  const hashedPassword = fields["Hasło"];
  if (!hashedPassword) {
    return res.status(401).json({ error: "No password set" });
  }

  // Porównujemy hasło przy użyciu bcrypt
  let isMatch;
  try {
    isMatch = await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    console.error("Błąd przy porównywaniu hasła:", err);
    return res.status(500).json({ error: "Error comparing password" });
  }

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Jeśli hasło poprawne, zwracamy "recordId" i "clientName"
  return res.status(200).json({
    message: "Login successful",
    recordId: record.id,
    clientName: fields["Klient"] || "" // <- nazwa pola w Airtable to "Klient"
  });
}
