import { useState } from "react";
import { useCart } from "../../context/CartContext";
import EditCartModal from "./EditCartModal";

export default function CartItem({ suborder }) {
  const { removeFromCart, updateCartItem } = useCart();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleClose = () => setIsEditing(false);

  const handleUpdate = (updatedPositions) => {
    updateCartItem(suborder.suborder.suborderNumber, updatedPositions);
    setIsEditing(false);
  };

  // Wybieramy pozycje według płci:
  const meskiePositions = suborder.positions.filter(
    (pos) => pos.gender === "Męska"
  );
  const damskiePositions = suborder.positions.filter(
    (pos) => pos.gender === "Damska"
  );
  const dzieciecePositions = suborder.positions.filter(
    (pos) => pos.gender === "Dziecko"
  );

  return (
    <div style={styles.gridContainer}>
      {/* 1. Kolumna: Wizualizacja */}
      <div style={styles.imageCol}>
        {suborder.suborder.images?.[0] ? (
          <img
            src={suborder.suborder.images[0]}
            style={styles.image}
            alt="Produkt"
          />
        ) : (
          <div style={styles.noImage}>Brak wizualizacji</div>
        )}
      </div>

      {/* 2. Kolumna: Detale */}
      <div style={styles.detailsCol}>
        <h3>{suborder.suborder.productName}</h3>
        <p>Numer: {suborder.suborder.suborderNumber}</p>
        {/* Tu możesz dodać kolejne informacje, np. SKU, parametry itd. */}
      </div>

      {/* 3. Kolumna: Męskie */}
      <div style={styles.genderCol}>
        <h4>Męskie</h4>
        {meskiePositions.length === 0 ? (
          <p style={styles.empty}>—</p>
        ) : (
          meskiePositions.map((pos, i) => (
            <p key={i}>
              {pos.quantity} x {pos.size} | {pos.personalization || "Brak"} |{" "}
              {pos.number || "Brak"}
            </p>
          ))
        )}
      </div>

      {/* 4. Kolumna: Damskie */}
      <div style={styles.genderCol}>
        <h4>Damskie</h4>
        {damskiePositions.length === 0 ? (
          <p style={styles.empty}>—</p>
        ) : (
          damskiePositions.map((pos, i) => (
            <p key={i}>
              {pos.quantity} x {pos.size} | {pos.personalization || "Brak"} |{" "}
              {pos.number || "Brak"}
            </p>
          ))
        )}
      </div>

      {/* 5. Kolumna: Dziecięce */}
      <div style={styles.genderCol}>
        <h4>Dziecięce</h4>
        {dzieciecePositions.length === 0 ? (
          <p style={styles.empty}>—</p>
        ) : (
          dzieciecePositions.map((pos, i) => (
            <p key={i}>
              {pos.quantity} x {pos.size} | {pos.personalization || "Brak"} |{" "}
              {pos.number || "Brak"}
            </p>
          ))
        )}
      </div>

      {/* 6. Kolumna: Akcje (Edytuj, Usuń) */}
      <div style={styles.actionsCol}>
        <button onClick={handleEdit}>Edytuj</button>
        <button
          onClick={() => removeFromCart(suborder.suborder.suborderNumber)}
        >
          Usuń
        </button>
      </div>

      {/* Modal do edycji pozycji */}
      {isEditing && (
        <EditCartModal
          suborder={suborder.suborder}
          positions={suborder.positions}
          onClose={handleClose}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

/* Style – 6 kolumn w siatce (grid), z szerokościami dopasowanymi do założeń */
const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "300px 400px 150px 150px 150px 150px", 
    gap: "20px",
    marginBottom: "30px",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  imageCol: {
    // styl kolumny z obrazkiem
  },
  image: {
    width: "100%",
    height: "auto",
  },
  noImage: {
    width: "100%",
    height: "200px",
    background: "#f4f4f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777",
  },
  detailsCol: {
    // kolumna z detalami (nazwa produktu, numer zamówienia, itp.)
  },
  genderCol: {
    // kolumna np. Męskie / Damskie / Dziecięce
  },
  empty: {
    color: "#999",
    fontStyle: "italic",
  },
  actionsCol: {
    // ostatnia kolumna z przyciskami
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "flex-start",
  },
};
