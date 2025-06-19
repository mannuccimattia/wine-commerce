const NoResultsWine = () => {
  return (
    <div
      style={{
        textAlign: "center",
        color: "#A88B4D",
        padding: "40px 20px",
      }}
    >
      <i
        className="fas fa-wine-glass-alt"
        style={{ fontSize: "96px", marginBottom: "20px" }}
      ></i>
      <h2>Nessun vino trovato</h2>
      <p>Non preoccuparti, la nostra cantina è ancora piena!</p>
    </div>
  );
};

export default NoResultsWine;
