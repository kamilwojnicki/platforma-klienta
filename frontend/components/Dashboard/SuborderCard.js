// frontend/components/Dashboard/SuborderCard.js

import { useState } from "react";
import SuborderProductsModal from "./SuborderProductsModal";
import ReorderModal from "../ReorderModal";  // Dodajemy modal „Zrób domówienie”

export default function SuborderCard({ sub }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleOpenReorderModal = () => setReorderModalOpen(true);
  const handleCloseReorderModal = () => setReorderModalOpen(false);

  return (
    <div style={cardStyles.card}>
      {sub.images && sub.images.length > 0 ? (
        <img
          src={sub.images[0]}
          alt="Wizka"
          style={cardStyles.image}
        />
      ) : (
        <div style={cardStyles.noImage}>Brak wizualizacji</div>
      )}

      <div style={cardStyles.info}>
        <p style={{ margin: 0 }}>
          <strong>Numer:</strong> {sub.suborderNumber}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Produkt:</strong> {sub.productName}
        </p>
      </div>

      {/* Przycisk do wyświetlenia pozycji podzamówienia */}
      <button style={cardStyles.button} onClick={handleOpenModal}>
        Pokaż pozycje
      </button>

      {/* Przycisk do otwarcia modala „Zrób domówienie” */}
      <button style={cardStyles.button} onClick={handleOpenReorderModal}>
        Zrób domówienie
      </button>

      {/* Modal wyświetlający pozycje podzamówienia */}
      {modalOpen && (
        <SuborderProductsModal suborderId={sub.suborderNumber} onClose={handleCloseModal} />
      )}

      {/* Modal „Zrób domówienie” */}
      {reorderModalOpen && (
        <ReorderModal suborder={sub} onClose={handleCloseReorderModal} />
      )}
    </div>
  );
}

const cardStyles = {
  card: {
    width: "200px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    margin: "10px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    marginBottom: "8px",
    borderRadius: "4px",
  },
  noImage: {
    width: "100%",
    height: "120px",
    background: "#f4f4f4",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777",
    marginBottom: "8px",
  },
  info: {
    marginBottom: "8px",
  },
  button: {
    padding: "6px 10px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#ccc",
    borderRadius: "4px",
    marginTop: "5px",
  },
};
