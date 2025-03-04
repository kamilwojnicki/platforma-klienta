import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    // Stan określający, czy pokazać wszystkie, czy tylko 3
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetch("/api/orders")
            .then((res) => res.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Błąd pobierania zamówień:", error);
                setLoading(false);
            });
    }, []);

    // Jeśli showAll = false, to bierzemy 3 pierwsze
    const visibleOrders = showAll ? orders : orders.slice(0, 3);

    if (loading) {
        return <p>Ładowanie zamówień...</p>;
    }

    if (orders.length === 0) {
        return <p>Brak zamówień.</p>;
    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Twoje zamówienia</h1>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr style={{ background: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
                        <th style={styles.th}>Numer zamówienia</th>
                        <th style={styles.th}>Wizualizacje</th>
                        <th style={styles.th}>Data dodania zamówienia</th>
                        <th style={styles.th}>Data do wysyłki</th>
                        <th style={styles.th}>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleOrders.map((order) => (
                        <tr key={order.id} style={styles.tr}>
                            <td style={styles.td}>{order.numerZamowienia}</td>
                            <td style={styles.td}>
                                {Array.isArray(order.wizualizacje) && order.wizualizacje.length > 0 ? (
                                    order.wizualizacje.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Wizualizacja ${index + 1}`}
                                            style={styles.img}
                                        />
                                    ))
                                ) : (
                                    "Brak"
                                )}
                            </td>
                            <td style={styles.td}>{order.dataDodania}</td>
                            <td style={styles.td}>{order.dataWysylki}</td>
                            <td style={styles.td}>
                                {/* Przyciski akcji, np. szczegóły. 
                                    Póki nie robimy szczegółów, możesz usunąć ten Link. */}
                                <Link href={`/dashboard/${order.id}`}>
                                    <button style={styles.button}>Szczegóły zamówienia</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Przycisk do pokazania wszystkich, jeśli jest więcej niż 3 */}
            {!showAll && orders.length > 3 && (
                <button onClick={() => setShowAll(true)} style={styles.showAllBtn}>
                    Pokaż wszystkie ({orders.length})
                </button>
            )}
        </div>
    );
}

const styles = {
    th: { padding: "10px", borderBottom: "1px solid #ddd", textAlign: "left" },
    td: { padding: "10px", borderBottom: "1px solid #ddd" },
    tr: { borderBottom: "1px solid #ddd" },
    img: {
        width: "50px",
        height: "50px",
        objectFit: "cover",
        borderRadius: "5px",
        marginRight: "5px"
    },
    button: {
        padding: "5px 10px",
        cursor: "pointer"
    },
    showAllBtn: {
        marginTop: "10px",
        padding: "5px 10px",
        cursor: "pointer"
    }
};
