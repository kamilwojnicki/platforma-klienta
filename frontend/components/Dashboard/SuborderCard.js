// frontend/components/Dashboard/SuborderCard.js

export default function SuborderCard({ sub, onDomowienie }) {
    // sub zawiera { id, suborderNumber, productName, images }
    // onDomowienie to callback do kliknięcia w "Zrób domówienie"
  
    return (
      <div style={styles.card}>
        {sub.images.length > 0 ? (
          <img
            src={sub.images[0]}
            alt="Wizka"
            style={styles.image}
          />
        ) : (
          <div style={styles.noImage}>Brak wizualizacji</div>
        )}
  
        <div style={styles.info}>
          <p style={{ margin: 0 }}>
            <strong>Numer:</strong> {sub.suborderNumber}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Produkt:</strong> {sub.productName}
          </p>
        </div>
  
        <button style={styles.button} onClick={() => onDomowienie(sub)}>
          Zrób domówienie
        </button>
      </div>
    );
  }
  
  const styles = {
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
    },
  };
  