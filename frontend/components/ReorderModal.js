// frontend/components/ReorderModal.js
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ReorderModal({ suborder, onClose }) {
  const { addToCart } = useCart();
  const [positions, setPositions] = useState([]);

  // Funkcja dodająca nową pozycję
  const addPosition = () => {
    setPositions([
      ...positions,
      { id: Date.now(), quantity: 1, size: "", gender: "", personalization: "", number: "" }
    ]);
  };

  // Obsługa dodania do koszyka
  const handleSubmit = () => {
    addToCart({ suborder, positions });
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Ikona zamknięcia */}
        <button style={styles.closeButton} onClick={onClose}>✖</button>

        <h2>{suborder.productName}</h2>
        <img src={suborder.images[0]} alt="Wizka" style={styles.image} />

        <button onClick={addPosition} style={styles.addButton}>Dodaj pozycję</button>

        <div style={styles.scrollContainer}>
          {positions.map((pos, index) => (
            <div key={pos.id} style={styles.row}>
              <input
                type="number"
                value={pos.quantity}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].quantity = e.target.value;
                  setPositions(newPositions);
                }}
                placeholder="Ilość"
                style={styles.smallInput}
              />
              <select
                value={pos.gender}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].gender = e.target.value;
                  setPositions(newPositions);
                }}
                style={styles.input}
              >
                <option value="">Płeć</option>
                <option value="Męska">Męska</option>
                <option value="Damska">Damska</option>
                <option value="Dziecko">Dziecko</option>
              </select>
              <input
                type="text"
                value={pos.size}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].size = e.target.value;
                  setPositions(newPositions);
                }}
                placeholder="Rozmiar"
                style={styles.smallInput}
              />
              <input
                type="text"
                value={pos.personalization}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].personalization = e.target.value;
                  setPositions(newPositions);
                }}
                placeholder="Personalizacja"
                style={styles.input}
              />
              <input
                type="text"
                value={pos.number}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].number = e.target.value;
                  setPositions(newPositions);
                }}
                placeholder="Numer"
                style={styles.smallInput}
              />
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} style={styles.submitButton}>Dodaj do koszyka</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.5)", // Półprzezroczyste tło
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "750px", // Szerokość na desktopie - brak poziomego scrolla
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    zIndex: 1001,
    textAlign: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "auto",
    marginBottom: "10px",
  },
  scrollContainer: {
    maxHeight: "300px",
    overflowY: "auto",
    marginBottom: "15px",
  },
  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 2,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  smallInput: {
    flex: 1, // Mniejsze pola dla ilości, rozmiaru i numeru
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  addButton: {
    marginBottom: "10px",
    padding: "8px",
    background: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  submitButton: {
    padding: "10px",
    background: "#28a745",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
};
