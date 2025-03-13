// frontend/components/Dashboard/DashboardPage.js
import { useEffect, useState } from "react";
import { useClient } from "../../context/ClientContext";
import OrdersInProgress from "./OrdersInProgress";
import OrdersHistory from "./OrdersHistory";
import LoadingDots from "../../components/LoadingDots";

export default function DashboardPage() {
  const { selectedClient } = useClient(); // obiekt { recordId, clientName } lub null
  const [loading, setLoading] = useState(false);
  const [inProgress, setInProgress] = useState([]);
  const [last5History, setLast5History] = useState([]);

  useEffect(() => {
    if (!selectedClient) return;

    setLoading(true);
    // Filtrowanie zamówień po recordId
    fetch(`/api/orders?client=${encodeURIComponent(selectedClient.recordId)}&mode=dashboard`)
      .then((res) => res.json())
      .then((data) => {
        setInProgress(data.inProgress || []);
        setLast5History(data.last5History || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd pobierania zamówień:", err);
        setLoading(false);
      });
  }, [selectedClient]);

  if (!selectedClient) {
    return (
      <div style={styles.container}>
        <h1>Brak wybranego klienta</h1>
        <p>
          <a href="/">Wróć na stronę główną</a> i wybierz klienta.
        </p>
      </div>
    );
  }

  if (loading) {
    return <LoadingDots />;
  }

  return (
    <div style={styles.container}>
      <h1>Witaj w swoim panelu, {selectedClient.clientName}!</h1>

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
};
