import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GlobalContext from "../contexts/globalContext";
import { Alert } from "react-bootstrap"; // Import Bootstrap Alert

const SearchForm = () => {
  const { homeSearch, setHomeSearch } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState({
    id: "all",
    name: "All categories",
    slug: null,
  });

  const [selectedCategoryLabel, setSelectedCategoryLabel] =
    useState("All categories");
  const [showAlert, setShowAlert] = useState(false); // State for alert visibility
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message

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

  const handleCategoryChange = (id, name, slug = null) => {
    setSelectedCategory({ id, name, slug });
    setSelectedCategoryLabel(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedSearch = homeSearch.trim();

    // Se categoria diversa da "all" e campo di ricerca vuoto, naviga pagina categoria
    if (selectedCategory !== "all" && !trimmedSearch) {
      navigate(`/categoria/${selectedCategory.slug}`);
      setHomeSearch(""); // opzionale, pulisce input
      return;
    }

    // Se categoria "all" e campo di ricerca vuoto, vai a prodotti generici
    if (selectedCategory === "all" && !trimmedSearch) {
      navigate("/products");
      return;
    }

    // Se categoria diversa da "all" e c'è testo, fai la ricerca con filtro categoria
    if (selectedCategory !== "all" && trimmedSearch) {
      const searchUrl = `/search?search=${encodeURIComponent(
        trimmedSearch
      )}&category=${selectedCategory}`;
      navigate(searchUrl);
      setHomeSearch("");
      return;
    }

    // Se categoria "all" e c'è testo, ricerca generica senza categoria
    if (selectedCategory === "all" && trimmedSearch) {
      const searchUrl = `/search?search=${encodeURIComponent(trimmedSearch)}`;
      navigate(searchUrl);
      setHomeSearch("");
      return;
    }
  };

  return (
    <form id="homeSearch" onSubmit={handleSubmit} className="px-3">
      {/* Desktop */}
      <div className="d-none d-md-flex align-items-stretch gap-2">
        <div className="input-group">
          <button
            className="btn btn-outline-light dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ minWidth: "180px" }}
          >
            {selectedCategoryLabel}
          </button>
          <ul className="dropdown-menu bg-dark">
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  handleCategoryChange("all", "All categories", null)
                }
              >
                All categories
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() =>
                    handleCategoryChange(
                      category.id,
                      category.name,
                      category.slug
                    )
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
            data-bs-theme="dark"
            placeholder="Search by name, year or producer"
            value={homeSearch}
            onChange={handleInputChange}
            aria-label="Search input"
            style={{ fontFamily: "sans-serif" }}
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

      {/* Mobile */}
      <div className="d-md-none">
        <div className="mb-2">
          <div className="dropdown w-100">
            <button
              className="btn btn-outline-light dropdown-toggle w-100 text-start"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ minHeight: "44px" }}
            >
              <i className="fa-solid fa-filter me-2"></i>
              {selectedCategoryLabel}
            </button>
            <ul className="dropdown-menu w-100  bg-dark">
              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() =>
                    handleCategoryChange("all", "All categories", null)
                  }
                >
                  All categories
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() =>
                      handleCategoryChange(
                        category.id,
                        category.name,
                        category.slug
                      )
                    }
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            data-bs-theme="dark"
            placeholder="Search by name, year or producer"
            value={homeSearch}
            onChange={handleInputChange}
            aria-label="Search input"
            style={{ minHeight: "44px", fontFamily: "sans-serif" }}
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
      {/* Bootstrap Alert */}
      {showAlert && (
        <Alert
          className="mt-2"
          variant="danger"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
    </form>
  );
};

export default SearchForm;
