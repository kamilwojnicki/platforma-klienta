// frontend/components/Dashboard/DashboardPage.js
import { useEffect, useState } from "react";
import OrdersInProgress from "./OrdersInProgress";
import OrdersHistory from "./OrdersHistory";

export default function DashboardPage() {
  // Stan przechowujący wybranego klienta
  const [selectedClient, setSelectedClient] = useState("Piko-Sport");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const clients = ["Piko-Sport", "66 projekt", "SoundVoice OÜ"];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/orders?client=${encodeURIComponent(selectedClient)}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
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

      {/* MODUŁ: Wybór klienta */}
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

      {/* Moduł 1: Trwające zamówienia */}
      <OrdersInProgress orders={orders} />

      {/* Moduł 2: Historia zamówień */}
      <OrdersHistory orders={orders} />
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
