// frontend/components/Dashboard/SuborderCard.js
import { useState } from "react";
import AddToCartModal from "../AddToCartModal"; // Upewnij się, że ścieżka jest poprawna

export default function SuborderCard({ sub }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleOpenModal = () => setIsAdding(true);
  const handleCloseModal = () => setIsAdding(false);

  return (
    <div style={styles.card}>
      {/* Wizualizacja produktu */}
      {sub.images && sub.images.length > 0 ? (
        <img src={sub.images[0]} alt="Wizualizacja" style={styles.image} />
      ) : (
        <div style={styles.noImage}>Brak wizualizacji</div>
      )}

      {/* Nazwa i szczegóły */}
      <div style={styles.details}>
        <h3 style={{ margin: "0 0 10px 0" }}>{sub.productName}</h3>
        <p style={{ margin: "0 0 5px 0" }}>
          <strong>Numer:</strong> {sub.suborderNumber}
        </p>
      </div>

      {/* Przycisk "Zrób domówienie" */}
      <button onClick={handleOpenModal} style={styles.button}>
        Zrób domówienie
      </button>

      {/* Modal do dodania nowego zamówienia do koszyka */}
      {isAdding && (
        <AddToCartModal
          suborder={sub}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    alignItems: "flex-start",
    padding: "10px",
    margin: "10px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
    gap: "15px",
  },
  image: {
    width: "150px",
    height: "auto",
    borderRadius: "4px",
    objectFit: "cover",
  },
  noImage: {
    width: "150px",
    height: "150px",
    background: "#f4f4f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777",
    borderRadius: "4px",
  },
  details: {
    flex: 1,
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
};
