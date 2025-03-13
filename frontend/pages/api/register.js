// frontend/pages/api/register.js
import Airtable from 'airtable';
import crypto from 'crypto';
import { sendInvitationEmail } from '../../utils/sendInvitationEmail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, clientName } = req.body;
  if (!email || !clientName) {
    return res.status(400).json({ error: 'Email and clientName are required' });
  }

  // Generowanie unikalnego tokena aktywacyjnego
  const token = crypto.randomBytes(20).toString('hex');

  // Połączenie z Airtable
  const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);

  // Sprawdzenie, czy rekord o danym e-mailu już istnieje
  const filterFormula = `{Email} = "${email}"`;
  let existingRecords = [];
  try {
    existingRecords = await base('Klienci').select({
      filterByFormula: filterFormula,
      maxRecords: 1,
    }).all();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Airtable error' });
  }

  if (existingRecords.length > 0) {
    // Aktualizacja istniejącego rekordu
    const recordId = existingRecords[0].id;
    try {
      await base('Klienci').update(recordId, {
        'Token aktywacyjny': token,
        'Status konta': 'Oczekujące',
      });
      // Wysyłka e-maila zapraszającego
      await sendInvitationEmail(email, token, recordId, clientName);
      return res.status(200).json({
        message: 'User updated, activation token set, invitation sent',
        token,
        recordId
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating record' });
    }
  } else {
    // Utworzenie nowego rekordu
    try {
      const newRecord = await base('Klienci').create({
        'Email': email,
        'Token aktywacyjny': token,
        'Status konta': 'Oczekujące',
        'Klient': clientName,
      });
      // Wysyłka e-maila zapraszającego
      await sendInvitationEmail(email, token, newRecord.id, clientName);
      return res.status(200).json({
        message: 'User created, activation token set, invitation sent',
        token,
        recordId: newRecord.id
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error creating record' });
    }
  }
}
