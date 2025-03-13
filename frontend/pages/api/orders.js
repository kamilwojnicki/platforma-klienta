// frontend/pages/api/orders.js
import Airtable from "airtable";

export default async function handler(req, res) {
  try {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
      .base(process.env.AIRTABLE_BASE_ID);

    // Parametry zapytania
    // Przykładowy URL: /api/orders?client=recAbc123&mode=allHistory
    const clientParam = req.query.client || "Piko-Sport";
    const mode = req.query.mode || "dashboard";

    // Filtrujemy rekordy na podstawie pola "Record_ID" w tabeli "Zlecenia bez podziału"
    const formula = `{Record_ID} = "${clientParam}"`;

    // Pobieramy rekordy z tabeli "Zlecenia bez podziału"
    const allRecords = await base(process.env.AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: formula,
        pageSize: 100,
      })
      .all();

    // Mapowanie pól – używamy pola "Wizki mini" do obrazków
    const mapped = allRecords.map((record) => {
      return {
        id: record.id,
        numerZamowienia: record.fields["Zamówienie"] || "Brak",
        wizualizacje: Array.isArray(record.fields["Wizki mini"])
          ? record.fields["Wizki mini"].map((obj) => obj.url)
          : [],
        dataDodania: record.fields["Data dodania zamówienia"] || "Brak",
        dataWysylki: record.fields["Data do wysyłki"] || "Brak",
        statusWysylki: record.fields["Status wysyłki"] || "",
      };
    });

    if (mode === "dashboard") {
      // Tryb "dashboard" – wyciągamy zamówienia trwające (bez statusu) i 5 ostatnich wysłanych

      // In-progress: brak statusu wysyłki
      let inProgress = mapped.filter((o) => !o.statusWysylki);
      inProgress.sort((a, b) => {
        const dateA = a.dataWysylki ? new Date(a.dataWysylki) : new Date("9999-12-31");
        const dateB = b.dataWysylki ? new Date(b.dataWysylki) : new Date("9999-12-31");
        return dateA - dateB;
      });

      // Wysłane: mają status wysyłki
      let sent = mapped.filter((o) => o.statusWysylki);
      sent.sort((a, b) => {
        const dateA = a.dataWysylki ? new Date(a.dataWysylki) : new Date(0);
        const dateB = b.dataWysylki ? new Date(b.dataWysylki) : new Date(0);
        return dateB - dateA;
      });

      // Ograniczamy do 5 najnowszych zamówień w historii
      const last5History = sent.slice(0, 5);

      return res.status(200).json({
        inProgress,
        last5History,
      });
    } else if (mode === "allHistory") {
      // Tryb "allHistory": zwracamy wszystkie zamówienia z historią (te z ustawionym statusem wysyłki)
      const sent = mapped.filter((o) => o.statusWysylki);
      sent.sort((a, b) => {
        const dateA = a.dataWysylki ? new Date(a.dataWysylki) : new Date(0);
        const dateB = b.dataWysylki ? new Date(b.dataWysylki) : new Date(0);
        return dateB - dateA;
      });
      return res.status(200).json(sent);
    }

    // Domyślnie zwracamy pełną tablicę, jeśli tryb nie został określony
    return res.status(200).json(mapped);
  } catch (error) {
    console.error("❌ Błąd w /api/orders:", error.message);
    res.status(500).json({ error: "Błąd połączenia z Airtable", details: error.message });
  }
}
