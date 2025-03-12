// frontend/components/Dashboard/DashboardPage.js
import { useEffect, useState } from "react";
import { useClient } from "../../context/ClientContext"; 
import OrdersInProgress from "./OrdersInProgress";
import OrdersHistory from "./OrdersHistory";
import LoadingDots from "../../components/LoadingDots";

export default function DashboardPage() {
  const { selectedClient } = useClient();   // <-- stan wybranego klienta z kontekstu
  const [loading, setLoading] = useState(false);
  const [inProgress, setInProgress] = useState([]);
  const [last5History, setLast5History] = useState([]);

  useEffect(() => {
    if (!selectedClient) return;

    setLoading(true);
    fetch(`/api/orders?client=${encodeURIComponent(selectedClient)}&mode=dashboard`)
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

  // Jeśli nie wybrano klienta, informujemy o konieczności powrotu do strony głównej
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
      <h1>Witaj w swoim panelu!</h1>

      {/* TRWAJĄCE ZAMÓWIENIA */}
      <OrdersInProgress orders={inProgress} />

      {/* HISTORIA (ostatnie 5) */}
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
