export default function OrdersInProgress({ orders }) {
    // Zamówienie jest w trakcie, jeśli 'Status wysyłki' jest puste (null, undefined lub pusty string)
    const inProgressOrders = orders.filter((order) => {
      // Zakładam, że w obiekcie "order" to pole to: order.statusWysylki
      // lub order.fields["Status wysyłki"] (zależnie od tego, jak mapujesz w API).
      // Tutaj piszę w stylu: order.statusWysylki === undefined
      return !order.statusWysylki || order.statusWysylki.trim() === "";
    });
  
    return (
      <div style={styles.container}>
        <h2>Trwające zamówienia</h2>
        {inProgressOrders.length === 0 ? (
          <p>Brak trwających zamówień.</p>
        ) : (
          <ul style={styles.list}>
            {inProgressOrders.map((order) => (
              <li key={order.id} style={styles.listItem}>
                <strong>{order.numerZamowienia}</strong> – w trakcie
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  
  const styles = {
    container: {
      marginBottom: "20px",
    },
    list: {
      listStyle: "none",
      paddingLeft: 0,
    },
    listItem: {
      marginBottom: "10px",
    },
  };
  