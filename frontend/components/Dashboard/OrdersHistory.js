import Link from "next/link";
import styles from "./dashboardTable.module.css";

export default function OrdersHistory({ orders }) {
  // Zamówienie wysłane = statusWysylki niepuste
  let sentOrders = orders.filter((order) => order.statusWysylki);

  // Sortowanie po dacieWysylki malejąco (najnowsze na górze)
  // Najpierw konwertujemy dataWysylki do Date, jeśli to string "YYYY-MM-DD"
  sentOrders = sentOrders.sort((a, b) => {
    const dateA = a.dataWysylki ? new Date(a.dataWysylki) : new Date(0);
    const dateB = b.dataWysylki ? new Date(b.dataWysylki) : new Date(0);

    // Sort malejąco -> nowsza data = większa, powinna być wyżej
    return dateB - dateA; // dateB - dateA => nowsza data (większa) jest wyżej
  });

  // Wyświetlamy tylko 5
  sentOrders = sentOrders.slice(0, 5);

  return (
    <div className={styles.container}>
      <h2>Historia zamówień</h2>

      {sentOrders.length === 0 ? (
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
            {sentOrders.map((order) => (
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
                  <Link href={`/dashboard/${order.id}`}>
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
