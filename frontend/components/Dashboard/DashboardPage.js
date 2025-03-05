import { useEffect, useState } from "react";
import OrdersInProgress from "./OrdersInProgress";
import OrdersHistory from "./OrdersHistory";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders") // <-- Załóżmy, że API jest gotowe
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd pobierania zamówień:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Ładowanie dashboardu...</p>;
  }

  return (
    <div style={styles.container}>
      <h1>Witaj w swoim panelu!</h1>

      {/* Moduł 1: Trwające zamówienia */}
      <OrdersInProgress orders={orders} />

      {/* Moduł 2: Historia zamówień (3 najnowsze wysłane) */}
      <OrdersHistory orders={orders} />

      {/* Tutaj w przyszłości: 
          <ProductsSection />
          <ProposalsSection />
      */}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
};
