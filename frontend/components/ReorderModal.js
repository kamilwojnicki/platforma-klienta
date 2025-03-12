import { useState } from "react";

export default function ReorderModal({
  suborder,
  positions = [],   // <-- Domyślna wartość zapobiega błędom "positions is not iterable"
  onClose,
  onUpdate,         // <-- Funkcja wywoływana po kliknięciu "Zaktualizuj produkty"
}) {
  // Ustawiamy stan na kopię przekazanych pozycji (by móc je edytować)
  const [updatedPositions, setUpdatedPositions] = useState([...positions]);

  // Dodajemy nową pozycję (rozmiar, ilość, personalizacja, itp.)
  const addPosition = () => {
    setUpdatedPositions([
      ...updatedPositions,
      {
        quantity: 1,
        size: "",
        gender: "",
        personalization: "",
        number: "",
      },
    ]);
  };

  // Zmiana konkretnych pól w pozycji
  const handleChange = (index, field, value) => {
    const newPositions = [...updatedPositions];
    newPositions[index][field] = value;
    setUpdatedPositions(newPositions);
  };

  // Kliknięcie "Zaktualizuj produkty" → aktualizuje element w koszyku
  const handleSubmit = () => {
    onUpdate(updatedPositions);
    onClose();
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button onClick={onClose} style={styles.closeButton}>✖</button>

        <h2>{suborder?.productName || "Nieznany produkt"}</h2>
        {Array.isArray(suborder?.images) && suborder.images.length > 0 ? (
          <img
            src={suborder.images[0]}
            alt="Wizka"
            style={styles.image}
          />
        ) : (
          <div style={styles.noImage}>Brak wizualizacji</div>
        )}

        <button onClick={addPosition} style={styles.addButton}>
          Dodaj pozycję
        </button>

        {updatedPositions.map((pos, index) => (
          <div key={index} style={styles.positionRow}>
            <input
              type="number"
              value={pos.quantity}
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
              placeholder="Ilość"
            />
            <input
              type="text"
              value={pos.size}
              onChange={(e) => handleChange(index, "size", e.target.value)}
              placeholder="Rozmiar"
            />
            <input
              type="text"
              value={pos.personalization}
              onChange={(e) => handleChange(index, "personalization", e.target.value)}
              placeholder="Personalizacja"
            />
            <input
              type="text"
              value={pos.number}
              onChange={(e) => handleChange(index, "number", e.target.value)}
              placeholder="Numer"
            />
          </div>
        ))}

        <button onClick={handleSubmit} style={styles.saveButton}>
          Zaktualizuj produkty
        </button>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "600px",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  noImage: {
    width: "100%",
    height: "200px",
    background: "#f4f4f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777",
    fontSize: "14px",
    marginBottom: "10px",
  },
  addButton: {
    marginBottom: "10px",
    padding: "8px 12px",
    background: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  positionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  saveButton: {
    marginTop: "20px",
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
};
