import Airtable from 'airtable';

export default async function handler(req, res) {
    try {
        const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
            .base(process.env.AIRTABLE_BASE_ID);

        // Odczyt parametru z query, np. ?client=66 projekt
        // Jeśli brak parametru, domyślnie np. "Piko-Sport"
        const clientParam = req.query.client || "Piko-Sport";

        // Pobieramy WSZYSTKIE rekordy
        const allRecords = await base(process.env.AIRTABLE_TABLE_NAME)
            .select({ pageSize: 100 })
            .all();

        // Filtrowanie po kliencie uproszczonym
        const filtered = allRecords.filter((record) => 
            record.fields["Klient uproszczony"] === clientParam
        );

        // Mapowanie pól (zostaje jak było)
        const orders = filtered.map((record) => {
            // ...
            return {
                id: record.id,
                numerZamowienia: record.fields["Zamówienie"] || "Brak",
                wizualizacje: Array.isArray(record.fields["Wizualizacje"])
                  ? record.fields["Wizualizacje"].map(obj => obj.url)
                  : [],
                dataDodania: Array.isArray(record.fields["Data dodania zamówienia"])
                  ? record.fields["Data dodania zamówienia"][0]
                  : record.fields["Data dodania zamówienia"] || "Brak",
                dataWysylki: Array.isArray(record.fields["Data do wysyłki"])
                  ? record.fields["Data do wysyłki"][0]
                  : record.fields["Data do wysyłki"] || "Brak",
                statusWysylki: record.fields["Status wysyłki"] || ""
            };
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error("❌ Błąd w API:", error.message);
        res.status(500).json({ error: "Błąd połączenia z Airtable", details: error.message });
    }
}
