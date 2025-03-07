import Airtable from 'airtable';

export default async function handler(req, res) {
    try {
        const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
            .base(process.env.AIRTABLE_BASE_ID);

        // 1. Odczyt parametru klienta
        const clientParam = req.query.client || "Piko-Sport";

        // 2. Odczyt parametru mode
        const mode = req.query.mode || "dashboard"; 
        // "dashboard" -> zwróć { inProgress, last5History }
        // "allHistory" -> można by zwrócić pełną historię, itp.

        // 3. Pobranie wszystkich rekordów
        const allRecords = await base(process.env.AIRTABLE_TABLE_NAME)
            .select({ pageSize: 100 })
            .all();

        // 4. Filtrowanie po kliencie uproszczonym
        const filtered = allRecords.filter(
            (record) => record.fields["Klient uproszczony"] === clientParam
        );

        // 5. Mapowanie pól
        const mapped = filtered.map((record) => {
            return {
                id: record.id,
                numerZamowienia: record.fields["Zamówienie"] || "Brak",
                wizualizacje: Array.isArray(record.fields["Wizualizacje"])
                    ? record.fields["Wizualizacje"].map((obj) => obj.url)
                    : [],
                dataDodania: Array.isArray(record.fields["Data dodania zamówienia"])
                    ? record.fields["Data dodania zamówienia"][0]
                    : record.fields["Data dodania zamówienia"] || "Brak",
                dataWysylki: Array.isArray(record.fields["Data do wysyłki"])
                    ? record.fields["Data do wysyłki"][0]
                    : record.fields["Data do wysyłki"] || "Brak",
                statusWysylki: record.fields["Status wysyłki"] || "",
            };
        });

        // 6. Jeśli chcemy standardowe „dashboard”
        if (mode === "dashboard") {
            // A) Wyciągamy TRWAJĄCE i sortujemy rosnąco po dataWysylki
            let inProgress = mapped.filter(
                (o) => !o.statusWysylki
            );
            inProgress = inProgress.sort((a, b) => {
                const dateA = a.dataWysylki ? new Date(a.dataWysylki) : new Date("9999-12-31");
                const dateB = b.dataWysylki ? new Date(b.dataWysylki) : new Date("9999-12-31");
                return dateA - dateB; 
            });

            // B) Wyciągamy WYSŁANE i sortujemy malejąco, bierzemy tylko 5
            let sent = mapped.filter(
                (o) => o.statusWysylki
            );
            sent = sent.sort((a, b) => {
                const dateA = a.dataWysylki ? new Date(a.dataWysylki) : new Date(0);
                const dateB = b.dataWysylki ? new Date(b.dataWysylki) : new Date(0);
                return dateB - dateA; 
            });
            const last5History = sent.slice(0, 5);

            return res.status(200).json({
                inProgress,
                last5History
            });
        }

        // 7. Inne tryby (np. allHistory)
        // ...
        // Domyślnie zwracamy mapped (lub pustą tablicę):
        return res.status(200).json(mapped);

    } catch (error) {
        console.error("❌ Błąd w API:", error.message);
        res.status(500).json({ error: "Błąd połączenia z Airtable", details: error.message });
    }
}
