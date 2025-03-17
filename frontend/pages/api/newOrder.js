// frontend/pages/api/newOrder.js
import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const { originalOrderId, items, suborderIndex } = req.body;
  if (!originalOrderId) {
    return res.status(400).json({ error: "originalOrderId is required" });
  }
  // suborderIndex jest opcjonalny – domyślnie 0
  const subIndex = (typeof suborderIndex === "number") ? suborderIndex : 0;
  
  // Połączenie z Airtable
  const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
  
  // 1) Pobieramy oryginalny rekord z tabeli "Orders"
  let originalRecord;
  try {
    originalRecord = await base('Orders').find(originalOrderId);
  } catch (err) {
    console.error("Error fetching original order record:", err);
    return res.status(500).json({ error: "Error fetching original order record", details: err.message });
  }
  
  // Pobieramy pola z oryginalnego rekordu
  const fields = originalRecord.fields;
  
  // Lista pól do skopiowania z oryginalnego rekordu
  const fieldsToCopy = {
    "autor_plikow": fields["autor_plikow"] || "",
    "Dodatki": fields["Dodatki"] || "",
    "Email kontaktowy": fields["Email kontaktowy"] || "",
    "Material": fields["Material"] || "",
    "Metka": fields["Metka"] || "",
    "Osoba kontaktowa": fields["Osoba kontaktowa"] || "",
    "SKU": fields["SKU"] || "",
    "Szwy": fields["Szwy"] || "",
    "Typ_zamowienia": fields["Typ_zamowienia"] || "",
    "visualization_url": fields["visualization_url"] || "",
    "Zakceptowana wizualizacja": fields["Zakceptowana wizualizacja"] || "",
    "Źródło": fields["Źródło"] || "",
    "Żakardy": fields["Żakardy"] || ""
  };
  
  // 2) Generowanie numeru podzamówienia
  // a) Obliczamy prefiks: YY-MM-
  const now = new Date();
  const yearPart = now.getFullYear().toString().slice(-2);
  const monthPart = (now.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `${yearPart}-${monthPart}-`;
  
  // b) Wyszukujemy istniejące zamówienia z tego miesiąca
  let existingOrders = [];
  try {
    // Używamy REGEX_MATCH, aby znaleźć rekordy, których pole "zamowienie" zaczyna się od prefiksu
    existingOrders = await base("Orders").select({
      filterByFormula: `REGEX_MATCH({zamowienie}, "^${prefix}")`,
      fields: ["zamowienie"]
    }).all();
  } catch (err) {
    console.error("Error fetching existing orders for numbering:", err);
    // Jeśli zapytanie nie powiedzie się, zaczynamy od 1001
  }
  
  let maxSeq = 1000;
  existingOrders.forEach(record => {
    const orderNum = record.fields["zamowienie"];
    if (orderNum) {
      const parts = orderNum.split("-");
      if (parts.length === 4) {
        const seq = parseInt(parts[2], 10);
        if (seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  });
  
  const newSeq = maxSeq + 1;
  // c) Generujemy literkę podzamówienia, np. 0 -> "a", 1 -> "b", ...
  const letterSuffix = String.fromCharCode(97 + subIndex); // 97 to 'a'
  const orderNumberFinal = `${prefix}${newSeq}-${letterSuffix}`;
  
  // 3) Dodatkowe pola dla nowego domówienia
  const additionalFields = {
    "autor_zlecenia": "Klient z platformy",
    "Data dodania zamowienia": now.toISOString().split("T")[0],
    "domówienie": true,
    "zamowienie": orderNumberFinal
  };
  
  // 4) Tworzymy nowy rekord w tabeli "Orders" – nowe domówienie
  try {
    const newRecord = await base("Orders").create({
      ...fieldsToCopy,
      ...additionalFields
      // Opcjonalnie: dodaj pole na pozycje, np. "Pozycje": JSON.stringify(items)
    });
    return res.status(200).json({ 
      message: "Domówienie utworzone",
      newOrderId: newRecord.id,
      orderNumber: orderNumberFinal
    });
  } catch (err) {
    console.error("Error creating new order record:", err);
    return res.status(500).json({ error: "Error creating new order record", details: err.message });
  }
}
