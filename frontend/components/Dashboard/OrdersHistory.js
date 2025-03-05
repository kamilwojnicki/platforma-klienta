export default function OrdersHistory({ orders }) {
    // Zamówienie wysłane, jeśli 'Status wysyłki' jest niepuste
    // plus ewentualne sortowanie
    const sentOrders = orders
      .filter((order) => {
        return order.statusWysylki && order.statusWysylki.trim() !== "";
      })
      .sort((a, b) => b.id - a.id) // lub sort po dacie
      .slice(0, 3);
  
    return (
      <div style={styles.container}>
        <h2>Historia zamówień</h2>
        {sentOrders.length === 0 ? (
          <p>Brak zrealizowanych zamówień.</p>
        ) : (
          <ul style={styles.list}>
            {sentOrders.map((order) => (
              <li key={order.id} style={styles.listItem}>
                <strong>{order.numerZamowienia}</strong> – wysłane
              </li>
            ))}
          </ul>
        )}
        <button style={styles.button} onClick={() => alert("Przejdź do /orders")}>
          Zobacz wszystkie
        </button>
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
    button: {
      padding: "8px 12px",
      cursor: "pointer",
    },
  };
  