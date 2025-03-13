// frontend/pages/api/activate.js
import Airtable from 'airtable';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, recordId, password } = req.body;
  if (!token || !recordId || !password) {
    return res.status(400).json({ error: 'Token, recordId and password are required' });
  }

  // Połączenie z Airtable
  const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);

  // Pobieramy rekord klienta na podstawie recordId
  let record;
  try {
    record = await base('Klienci').find(recordId);
  } catch (err) {
    console.error("Błąd pobierania rekordu:", err);
    return res.status(500).json({ error: 'Error fetching record' });
  }

  // Weryfikacja tokena
  if (record.fields["Token aktywacyjny"] !== token) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  // Hashowanie nowego hasła
  let hashedPassword;
  try {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (err) {
    console.error("Błąd przy hashowaniu hasła:", err);
    return res.status(500).json({ error: 'Error hashing password' });
  }

  // Aktualizacja rekordu: ustawiamy hasło, status konta na "Aktywne" oraz Data aktywacji
  try {
    await base('Klienci').update(recordId, {
      'Hasło': hashedPassword,
      'Status konta': 'Aktywne',
      'Data aktywacji': new Date().toISOString().split('T')[0],// format ISO
      // Opcjonalnie możesz usunąć token, aby nie był już dostępny:
      'Token aktywacyjny': '',
    });
    return res.status(200).json({ message: 'Account activated successfully' });
  } catch (err) {
    console.error("Błąd przy aktualizacji rekordu:", err);
    return res.status(500).json({ error: 'Error updating record' });
  }
}
