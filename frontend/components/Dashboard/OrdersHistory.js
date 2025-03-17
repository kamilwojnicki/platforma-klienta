// frontend/components/Dashboard/OrdersHistory.js
import Link from "next/link";
import styles from "./dashboardTable.module.css";
import { useClient } from "../../context/ClientContext";
import { Button } from "@mui/material";

export default function OrdersHistory({ orders }) {
  const { selectedClient } = useClient();

  return (
    <div className={styles.container}>
      <h2>Historia zamówień</h2>
      {orders.length === 0 ? (
        <p>Brak zrealizowanych zamówień.</p>
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
                  {selectedClient ? (
                    <Link
                    href={`/dashboard/${order.numerZamowienia}`}
                      passHref
                      legacyBehavior
                    >
                      <Button variant="contained" size="small">
                        Szczegóły
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="contained" size="small" disabled>
                      Szczegóły
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedClient ? (
        <Link
          href={`/dashboard/history`}
          passHref
          legacyBehavior
        >
          <Button variant="outlined">Zobacz wszystkie</Button>
        </Link>
      ) : (
        <Button variant="outlined" disabled>
          Brak wybranego klienta
        </Button>
      )}
    </div>
  );
}
