// frontend/components/Cart/EditCartModal.js
import { useState } from "react";

export default function EditCartModal({ suborder, positions = [], onClose, onUpdate }) {
  const [updatedPositions, setUpdatedPositions] = useState([...positions]);

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

  const handleChange = (index, field, value) => {
    const newArr = [...updatedPositions];
    newArr[index][field] = value;
    setUpdatedPositions(newArr);
  };

  const handleSubmit = () => {
    onUpdate(updatedPositions);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>✖</button>
        <h2>{suborder?.productName || "Nieznany produkt"}</h2>

        {Array.isArray(suborder?.images) && suborder.images.length > 0 ? (
          <img src={suborder.images[0]} alt="Wizka" style={styles.image} />
        ) : (
          <div style={styles.noImage}>Brak wizualizacji</div>
        )}

        <button onClick={addPosition} style={styles.addButton}>Dodaj pozycję</button>

        {updatedPositions.map((pos, i) => (
          <div key={i} style={styles.positionRow}>
            <input
              type="number"
              value={pos.quantity}
              onChange={(e) => handleChange(i, "quantity", e.target.value)}
              placeholder="Ilość"
              style={styles.shortInput}
            />

            <input
              type="text"
              value={pos.size}
              onChange={(e) => handleChange(i, "size", e.target.value)}
              placeholder="Rozmiar"
              style={styles.shortInput}
            />

            <select
              value={pos.gender}
              onChange={(e) => handleChange(i, "gender", e.target.value)}
              style={styles.shortInput}
            >
              <option value="">Płeć</option>
              <option value="Męska">Męska</option>
              <option value="Damska">Damska</option>
              <option value="Dziecko">Dziecko</option>
            </select>

            <input
              type="text"
              value={pos.personalization}
              onChange={(e) => handleChange(i, "personalization", e.target.value)}
              placeholder="Personalizacja"
              style={styles.input}
            />
            <input
              type="text"
              value={pos.number}
              onChange={(e) => handleChange(i, "number", e.target.value)}
              placeholder="Numer"
              style={styles.shortInput}
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
  overlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "750px",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
  },
  closeButton: {
    position: "absolute", top: "10px", right: "10px", cursor: "pointer",
    background: "none", border: "none", fontSize: "16px",
  },
  image: {
    width: "100%", height: "auto", borderRadius: "4px", marginBottom: "10px",
  },
  noImage: {
    width: "100%", height: "200px",
    background: "#f4f4f4",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#777", marginBottom: "10px"
  },
  addButton: {
    marginBottom: "10px", padding: "8px 12px",
    background: "#007bff", color: "white", border: "none",
    cursor: "pointer", borderRadius: "4px",
  },
  positionRow: {
    display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap"
  },
  shortInput: {
    width: "80px",
    padding: "6px",
  },
  input: {
    flex: 1,
    padding: "6px",
  },
  saveButton: {
    marginTop: "20px", padding: "10px 15px",
    background: "#28a745", color: "white", border: "none",
    cursor: "pointer", borderRadius: "4px",
  },
};
