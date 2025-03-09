// frontend/pages/api/products.js

import Airtable from "airtable";

export default async function handler(req, res) {
  try {
    // Parametr suborderId (np. "25-02-582-a")
    const { suborderId } = req.query;
    if (!suborderId) {
      return res.status(400).json({ error: "Brak parametru suborderId" });
    }

    // Inicjalizacja Airtable
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
    }).base(process.env.AIRTABLE_BASE_ID);

    // Tabela "Products" (dopasuj nazwę)
    const tableName = "Products";

    // Zakładamy, że w polu "zamowienie" w "Products"
    // mamy DOKŁADNIE tę samą wartość tekstową co suborderId,
    // np. "25-02-582-a".
    // Dlatego prosta równość:
    const formula = `{zamowienie} = "${suborderId}"`;

    const records = await base(tableName)
      .select({
        filterByFormula: formula,
      })
      .all();

    // Mamy pola: SKU, Nazwa, personalizacja, rozmiar, plec, ilosc
    const products = records.map((rec) => {
      return {
        id: rec.id,  // ID rekordu w Airtable
        SKU: rec.fields["SKU"] || "",
        Nazwa: rec.fields["Nazwa"] || "",
        personalizacja: rec.fields["personalizacja"] || "",
        rozmiar: rec.fields["rozmiar"] || "",
        plec: rec.fields["plec"] || "",
        ilosc: rec.fields["ilosc"] || 0,
      };
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Błąd w /api/products:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
