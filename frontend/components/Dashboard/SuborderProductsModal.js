// frontend/components/Dashboard/SuborderProductsModal.js

import { useEffect, useState } from "react";

export default function SuborderProductsModal({ suborderId, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?suborderId=${encodeURIComponent(suborderId)}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd pobierania produktów:", err);
        setLoading(false);
      });
  }, [suborderId]);

  const formatGender = (gender) => {
    return gender === "Kids" ? "Dziecko" : gender;
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <button onClick={onClose} style={modalStyles.closeButton}>X</button>
        <h2>Pozycje podzamówienia</h2>
        {loading ? (
          <p>Ładowanie produktów...</p>
        ) : (
          <table style={modalStyles.table}>
            <thead>
              <tr>
                <th style={modalStyles.th}>Nazwa produktu</th>
                <th style={modalStyles.th}>Personalizacja</th>
                <th style={modalStyles.th}>Rozmiar</th>
                <th style={modalStyles.th}>Płeć</th>
                <th style={modalStyles.th}>Ilość</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={modalStyles.td}>{product.Nazwa}</td>
                  <td style={modalStyles.td}>{product.personalizacja || "-"}</td>
                  <td style={modalStyles.td}>{product.rozmiar || "-"}</td>
                  <td style={modalStyles.td}>{formatGender(product.plec)}</td>
                  <td style={modalStyles.td}>{product.ilosc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "600px",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    borderBottom: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },
  td: {
    borderBottom: "1px solid #ddd",
    padding: "8px",
  },
};
