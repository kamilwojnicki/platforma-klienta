import { useEffect, useState } from "react";
import OrdersInProgress from "./OrdersInProgress";
import OrdersHistory from "./OrdersHistory";

export default function DashboardPage() {
  const [selectedClient, setSelectedClient] = useState("Piko-Sport");

  // Zamiast "orders", mamy "inProgress" i "last5History"
  const [inProgress, setInProgress] = useState([]);
  const [last5History, setLast5History] = useState([]);

  const [loading, setLoading] = useState(true);

  const clients = ["Piko-Sport", "66 projekt", "SoundVoice OÜ"];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/orders?client=${encodeURIComponent(selectedClient)}&mode=dashboard`)
      .then((res) => res.json())
      .then((data) => {
        // data = { inProgress: [...], last5History: [...] }
        setInProgress(data.inProgress);
        setLast5History(data.last5History);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd pobierania zamówień:", err);
        setLoading(false);
      });
  }, [selectedClient]);

  if (loading) {
    return <p>Ładowanie dashboardu...</p>;
  }

  return (
    <div style={styles.container}>
      <h1>Witaj w swoim panelu!</h1>

      {/* Wybór klienta */}
      <div style={styles.clientSelector}>
        <label htmlFor="clientSelect" style={{ marginRight: "10px" }}>
          Wybierz klienta:
        </label>
        <select
          id="clientSelect"
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          style={styles.select}
        >
          {clients.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Przekazujemy inProgress i last5History do modułów */}
      <OrdersInProgress orders={inProgress} />
      <OrdersHistory orders={last5History} />
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  clientSelector: {
    marginBottom: "20px",
  },
  select: {
    padding: "5px",
  },
};
