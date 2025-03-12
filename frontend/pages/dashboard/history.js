// frontend/pages/dashboard/history.js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// Dodajemy Link z Next.js i Button z Material UI:
import Link from "next/link";
import { Button } from "@mui/material";
import LoadingDots from "../../components/LoadingDots";

import styles from "../../components/Dashboard/dashboardTable.module.css";

export default function AllHistoryPage() {
  const router = useRouter();
  const { client } = router.query; // odczyt parametru z URL-a, np. ?client=Piko-Sport
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dopiero gdy mamy 'client', pobieramy dane
    if (!client) return;

    setLoading(true);
    fetch(`/api/orders?client=${encodeURIComponent(client)}&mode=allHistory`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd w allHistory:", err);
        setLoading(false);
      });
  }, [client]);

  if (loading) {
    return <LoadingDots />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Wszystkie zrealizowane zamówienia klienta: {client}</h1>

      {orders.length === 0 ? (
        <p>Brak wysłanych zamówień.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.th}>Numer zamówienia</th>
              <th className={styles.th}>Status wysyłki</th>
              <th className={styles.th}>Wizualizacje</th>
              <th className={styles.th}>Data dodania</th>
              <th className={styles.th}>Data wysyłki</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={styles.row}>
                <td className={styles.td}>{order.numerZamowienia}</td>
                <td className={`${styles.td} ${styles.statusSent}`}>Wysłane</td>
                <td className={styles.td}>
                  {Array.isArray(order.wizualizacje) && order.wizualizacje.length > 0
                    ? order.wizualizacje.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt="wizualizacja"
                          className={styles.img}
                        />
                      ))
                    : "Brak"}
                </td>
                <td className={styles.td}>{order.dataDodania}</td>
                <td className={styles.td}>{order.dataWysylki}</td>
                <td className={styles.td}>
                  {/* Link do szczegółów zamówienia z parametrem ?client=... */}
                  <Link
                    href={`/dashboard/${order.numerZamowienia}?client=${encodeURIComponent(
                      client
                    )}`}
                    passHref
                  >
                    <Button variant="contained" size="small">
                      Szczegóły
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
