import Airtable from 'airtable';

export default async function handler(req, res) {
    try {
        const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
            .base(process.env.AIRTABLE_BASE_ID);

        // Pobieramy WSZYSTKIE rekordy (np. klient "Piko-Sport")
        const allRecords = await base(process.env.AIRTABLE_TABLE_NAME)
            .select({ pageSize: 100 })
            .all();

        // Filtrowanie po kliencie (jeśli chcesz)
        const filtered = allRecords.filter(record => 
            record.fields["Klient uproszczony"] === "Piko-Sport"
        );

        // Mapowanie pól
        const orders = filtered.map(record => {
            // Numer zamówienia
            const numerZamowienia = record.fields["Zamówienie"] || "Brak";
            
            // Wizualizacje (tablica obiektów z polami .url)
            const wizualizacje = Array.isArray(record.fields["Wizualizacje"])
                ? record.fields["Wizualizacje"].map(obj => obj.url)
                : [];

            // Data dodania zamówienia (lookup może zwracać tablicę, więc bierzemy pierwszy element)
            const dataDodania = Array.isArray(record.fields["Data dodania zamówienia"])
                ? record.fields["Data dodania zamówienia"][0]
                : record.fields["Data dodania zamówienia"] || "Brak";

            // Data do wysyłki (lookup również może zwracać tablicę)
            const dataWysylki = Array.isArray(record.fields["Data do wysyłki"])
                ? record.fields["Data do wysyłki"][0]
                : record.fields["Data do wysyłki"] || "Brak";

            return {
                id: record.id,               // ID rekordu w Airtable, ważne do szczegółów
                numerZamowienia,
                wizualizacje,
                dataDodania,
                dataWysylki
            };
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error("❌ Błąd w API:", error.message);
        res.status(500).json({ error: "Błąd połączenia z Airtable", details: error.message });
    }
}
