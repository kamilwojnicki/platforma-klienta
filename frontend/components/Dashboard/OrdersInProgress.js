import Link from "next/link";
import styles from "./dashboardTable.module.css";

export default function OrdersInProgress({ orders }) {
  // Zamówienie w trakcie, jeśli statusWysylki jest pusty
  let inProgressOrders = orders.filter((order) => !order.statusWysylki);

  // Sortowanie rosnąco (najbliższa dataWysylki u góry)
  // Jeśli dataWysylki jest pusta, możemy ustawić je na koniec listy (np. data = 9999-12-31).
  inProgressOrders = inProgressOrders.sort((a, b) => {
    const dateA = a.dataWysylki ? new Date(a.dataWysylki) : new Date("9999-12-31");
    const dateB = b.dataWysylki ? new Date(b.dataWysylki) : new Date("9999-12-31");

    // Porządek rosnący => mniejsza data jest wyżej
    return dateA - dateB;
  });

  return (
    <div className={styles.container}>
      <h2>Trwające zamówienia</h2>

      {inProgressOrders.length === 0 ? (
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
            {inProgressOrders.map((order) => (
              <tr key={order.id} className={styles.row}>
                <td className={styles.td}>{order.numerZamowienia}</td>
                <td className={`${styles.td} ${styles.statusInProgress}`}>Trwające</td>
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
                <td className={styles.td}>{order.dataWysylki || "Brak"}</td>
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
    </div>
  );
}
