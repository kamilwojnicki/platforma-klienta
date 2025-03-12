// frontend/pages/api/orders.js
import Airtable from "airtable";

export default async function handler(req, res) {
  try {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
      .base(process.env.AIRTABLE_BASE_ID);

    // Parametry zapytania
    // np. /api/orders?client=Piko-Sport&mode=allHistory
    const clientParam = req.query.client || "Piko-Sport";
    const mode = req.query.mode || "dashboard";

    // Przygotowanie filtra do pobierania tylko rekordów danego klienta
    // W polu "Klient uproszczony" w Airtable mamy np. "Piko-Sport", "66 projekt", itd.
    const formula = `{Klient uproszczony} = "${clientParam}"`;

    // Pobranie rekordów z tabeli "Zlecenia bez podziału"
    // pageSize=100 oznacza maks. 100 rekordów na „stronę”,
    // a .all() pobierze tyle stron, ile jest dostępnych, jednak
    // i tak ograniczamy się do klienta w filterByFormula.
    const allRecords = await base(process.env.AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: formula,
        pageSize: 100,
        // Możesz dodać sortowanie, np:
        // sort: [{ field: "Data dodania zamówienia", direction: "desc" }],
      })
      .all();

    // Mapowanie pól
    // Używamy mniejszego pola "Wizki mini" do obrazków
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

      // In-progress → brak statusWysylki
      let inProgress = mapped.filter((o) => !o.statusWysylki);
      // Sort rosnąco po dacieWysylki
      inProgress.sort((a, b) => {
        const dateA = a.dataWysylki ? new Date(a.dataWysylki) : new Date("9999-12-31");
        const dateB = b.dataWysylki ? new Date(b.dataWysylki) : new Date("9999-12-31");
        return dateA - dateB;
      });

      // Wysłane → statusWysylki != ""
      let sent = mapped.filter((o) => o.statusWysylki);
      // Sort malejąco po dacieWysylki
      sent.sort((a, b) => {
        const dateA = a.dataWysylki ? new Date(a.dataWysylki) : new Date(0);
        const dateB = b.dataWysylki ? new Date(b.dataWysylki) : new Date(0);
        return dateB - dateA;
      });

      // Ograniczamy do 5
      const last5History = sent.slice(0, 5);

      return res.status(200).json({
        inProgress,
        last5History,
      });
    } else if (mode === "allHistory") {
      // Nowy tryb: zwracamy wszystkie zamówienia z historią (statusWysylki != "")
      const sent = mapped.filter((o) => o.statusWysylki);

      // Posortujmy malejąco po dacieWysylki
      sent.sort((a, b) => {
        const dateA = a.dataWysylki ? new Date(a.dataWysylki) : new Date(0);
        const dateB = b.dataWysylki ? new Date(b.dataWysylki) : new Date(0);
        return dateB - dateA;
      });

      return res.status(200).json(sent);
    }

    // W innych trybach zwracamy pełną tablicę mapped (lub można dodać kolejne tryby)
    return res.status(200).json(mapped);
  } catch (error) {
    console.error("❌ Błąd w /api/orders:", error.message);
    res
      .status(500)
      .json({ error: "Błąd połączenia z Airtable", details: error.message });
  }
}
