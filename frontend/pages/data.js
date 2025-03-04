import { useEffect, useState } from "react";

export default function DataPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/orders")
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Błąd w DataPage:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Podgląd struktury danych API</h1>
            <pre style={styles.pre}>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}

const styles = {
    pre: {
        background: "#f4f4f4",
        padding: "10px",
        borderRadius: "5px",
        overflowX: "auto",
        whiteSpace: "pre-wrap"
    }
};
