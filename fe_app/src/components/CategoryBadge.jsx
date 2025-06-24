import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";

const CategoryBadge = ({ categoryId }) => {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/wines/getcategories")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((cat) => cat.id === categoryId);
        if (match) setCategory(match);
      })
      .catch((err) => console.error("Errore nel fetch delle categorie:", err));
  }, [categoryId]);

  if (!category) return null;

  return (
    <a
      href={`http://localhost:5173/categoria/${categoryId}`}
      className="badge cat-badge"
      style={{
        fontSize: "0.65rem",
        padding: "0.15em 0.4em",
        textDecoration: "none",
        lineHeight: 1.1,
        display: "inline-block",
        backgroundColor: category.color || "#6c757d", // colore di default grigio
        color: "#fff",
      }}
    >
      {category.name}
    </a>
  );
};

CategoryBadge.propTypes = {
  categoryId: PropTypes.number.isRequired,
};

export default CategoryBadge;
