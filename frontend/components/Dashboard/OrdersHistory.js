import Link from "next/link";
import styles from "./dashboardTable.module.css";

export default function OrdersHistory({ orders }) {
  // orders są już przefiltrowane, sortowane i ograniczone do 5
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
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Wizualizacje</th>
              <th className={styles.th}>Data dodania zamówienia</th>
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
                  {/* Zmieniono order.id na order.numerZamowienia */}
                  <Link href={`/dashboard/${order.numerZamowienia}`}>
                    <button className={styles.button}>Zobacz szczegóły</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className={styles.showAllBtn} onClick={() => alert("Przejdź do /orders")}>
        Zobacz wszystkie
      </button>
    </div>
  );
}
