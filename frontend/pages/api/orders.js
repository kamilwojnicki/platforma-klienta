import Airtable from 'airtable';

export default async function handler(req, res) {
    try {
        // Inicjalizacja połączenia z Airtable
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
        
        // Pobranie rekordów z tabeli
        const records = await base(process.env.AIRTABLE_TABLE_NAME).select().firstPage();

        // Konwersja rekordów do prostszego formatu
        const orders = records.map(record => ({
            id: record.id,
            fields: record.fields
        }));

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd połączenia z Airtable' });
    }
}
