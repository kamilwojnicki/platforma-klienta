// frontend/pages/dashboard/[id].js
import { useRouter } from "next/router";
import Airtable from "airtable";
import { useClient } from "../../context/ClientContext";
import SuborderCard from "../../components/Dashboard/SuborderCard";

export default function OrderDetailsPage({ orderData, suborders }) {
  const router = useRouter();
  const { id } = router.query; // Tylko numer zamówienia
  const { selectedClient } = useClient(); // Obiekt z { recordId, clientName }

  // Jeśli brak zalogowanego klienta w kontekście, wyświetlamy błąd
  if (!selectedClient) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Brak wybranego klienta</h1>
        <p>Proszę się zalogować lub wybrać klienta w panelu.</p>
      </div>
    );
  }

  // Jeśli z bazy nie znaleziono zamówienia
  if (!orderData) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Order not found</h1>
        <p>Nie znaleziono zamówienia o numerze: {id}</p>
      </div>
    );
  }

  // Rendering szczegółów
  return (
    <div style={{ padding: "20px" }}>
      <h1>Szczegóły zamówienia: {id}</h1>
      <p><strong>Klient (z bazy):</strong> {orderData.klient}</p>
      <p><strong>Klient (z kontekstu):</strong> {selectedClient.clientName}</p>
      <p><strong>Status płatności:</strong> {orderData.statusPlatnosci}</p>
      <p><strong>Data dodania zamówienia:</strong> {orderData.dataDodania}</p>
      <p><strong>Data do wysyłki:</strong> {orderData.dataWysylki}</p>

      <hr style={{ margin: "20px 0" }} />

      <h2>Podzamówienia (Suborders)</h2>
      {suborders.length === 0 ? (
        <p>Brak podzamówień w tym zamówieniu.</p>
      ) : (
        <div style={detailsStyles.subordersGrid}>
          {suborders.map((sub) => (
            <SuborderCard key={sub.id} sub={sub} />
          ))}
        </div>
      )}
    </div>
  );
}

// getServerSideProps – pobiera dane zamówienia + suborders z Airtable
export async function getServerSideProps(context) {
  const { id } = context.params;
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
  }).base(process.env.AIRTABLE_BASE_ID);

  // 1) Pobieramy główne zamówienie z "Zlecenia bez podziału"
  const tableName = "Zlecenia bez podziału";
  const fieldName = "Zamówienie";

  let orderRecord = null;
  try {
    const records = await base(tableName)
      .select({
        filterByFormula: `{${fieldName}} = "${id}"`,
      })
      .all();

    if (records && records.length > 0) {
      orderRecord = records[0];
    }
  } catch (err) {
    console.error("Błąd pobierania zamówienia:", err);
  }

  if (!orderRecord) {
    return {
      props: {
        orderData: null,
        suborders: [],
      },
    };
  }

  const orderData = {
    dataDodania: orderRecord.fields["Data dodania zamówienia"] || "Brak",
    dataWysylki: orderRecord.fields["Data do wysyłki"] || "Brak",
    klient: orderRecord.fields["Klient uproszczony"] || "Brak klienta",
    statusPlatnosci: orderRecord.fields["Status płatności"] || "Brak statusu płatności",
  };

  // 2) Pobieramy subzamówienia z tabeli "Orders"
  let suborders = [];
  try {
    const subRecords = await base("Orders")
      .select({
        filterByFormula: `{krotsze zlecenie} = "${id}"`,
      })
      .all();

    suborders = subRecords.map((rec) => {
      const subNum = rec.fields["zamowienie"] || rec.id;
      const productName = rec.fields["Nazwa produktu"] || "Brak nazwy";

      let images = [];
      if (Array.isArray(rec.fields["Wizka mini"])) {
        images = rec.fields["Wizka mini"].map((att) => att.url);
      }

      return {
        id: rec.id,
        suborderNumber: subNum,
        productName,
        images,
      };
    });
  } catch (err) {
    console.error("Błąd pobierania suborders:", err);
  }

  return {
    props: {
      orderData,
      suborders,
    },
  };
}

const detailsStyles = {
  subordersGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
};
