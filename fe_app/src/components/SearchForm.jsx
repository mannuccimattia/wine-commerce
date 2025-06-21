import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GlobalContext from "../contexts/globalContext";

const SearchForm = () => {
  const { homeSearch, setHomeSearch } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCategoryLabel, setSelectedCategoryLabel] =
    useState("Tutte le categorie");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:3000/api/wines/getcategories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Errore nel recupero delle categorie:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => setHomeSearch(e.target.value);

  const handleCategoryChange = (id, label) => {
    setSelectedCategory(id);
    setSelectedCategoryLabel(label);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Se è selezionata una categoria specifica, il campo di ricerca è obbligatorio
    if (selectedCategory !== "all" && !homeSearch.trim()) {
      alert("Inserisci un termine di ricerca per questa categoria");
      return;
    }

    // Se "tutte le categorie" e nessun testo → vai su /products
    if (selectedCategory === "all" && !homeSearch.trim()) {
      navigate("/products");
      return;
    }

    // Altrimenti costruisci URL
    let searchUrl = `/search?search=${encodeURIComponent(homeSearch)}`;
    if (selectedCategory !== "all") {
      searchUrl += `&category=${selectedCategory}`;
    }

    navigate(searchUrl);
    setHomeSearch("");
  };

  return (
    <form id="homeSearch" onSubmit={handleSubmit} className="px-3">
      {/* Desktop Layout */}
      <div className="d-none d-md-flex align-items-stretch gap-2">
        <div className="input-group">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ minWidth: "180px" }}
          >
            {selectedCategoryLabel}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  handleCategoryChange("all", "Tutte le categorie")
                }
              >
                Tutte le categorie
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() =>
                    handleCategoryChange(category.id, category.name)
                  }
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            className="form-control"
            placeholder="Search by name, year or producer"
            value={homeSearch}
            onChange={handleInputChange}
            aria-label="Search input"
          />
        </div>

        <button
          type="submit"
          className="btn btn-outline-light"
          aria-label="Search"
          title="Cerca"
          style={{ minWidth: "50px" }}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      {/* Mobile Layout */}
      <div className="d-md-none">
        {/* Category Dropdown - Full Width */}
        <div className="mb-2">
          <div className="dropdown w-100">
            <button
              className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ minHeight: "44px" }}
            >
              <i className="fa-solid fa-filter me-2"></i>
              {selectedCategoryLabel}
            </button>
            <ul className="dropdown-menu w-100">
              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() =>
                    handleCategoryChange("all", "Tutte le categorie")
                  }
                >
                  Tutte le categorie
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() =>
                      handleCategoryChange(category.id, category.name)
                    }
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Search Input + Button */}
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, year or producer"
            value={homeSearch}
            onChange={handleInputChange}
            aria-label="Search input"
            style={{ minHeight: "44px" }}
          />
          <button
            type="submit"
            className="btn btn-outline-light"
            aria-label="Search"
            title="Cerca"
            style={{ minWidth: "50px", minHeight: "44px" }}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
