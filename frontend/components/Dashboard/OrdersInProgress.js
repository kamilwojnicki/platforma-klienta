// frontend/components/Dashboard/OrdersInProgress.js
import Link from "next/link";
import styles from "./dashboardTable.module.css";
import { useClient } from "../../context/ClientContext";
import { Button } from "@mui/material";

export default function OrdersInProgress({ orders }) {
  const { selectedClient } = useClient();

  return (
    <div className={styles.container}>
      <h2>Trwające zamówienia</h2>
      {orders.length === 0 ? (
        <p>Brak trwających zamówień.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.th}>Numer zamówienia</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Wizualizacje</th>
              <th className={styles.th}>Data dodania zamówienia</th>
              <th className={styles.th}>Planowana data wysyłki</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={styles.row}>
                <td className={styles.td}>{order.numerZamowienia}</td>
                <td className={`${styles.td} ${styles.statusInProgress}`}>
                  Trwające
                </td>
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
    </div>
  );
}
