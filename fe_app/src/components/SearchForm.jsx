import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../contexts/globalContext";

const SearchForm = () => {
  const { homeSearch, setHomeSearch } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc"); // asc = crescente, desc = decrescente
  const handleHomeSearch = (e) => {
    setHomeSearch(e.target.value);
  };

  const handleHomeSearchSubmit = (e) => {
    e.preventDefault();
    if (!homeSearch.trim()) return;
    navigate(`/search?search=${encodeURIComponent(homeSearch)}`);
    setHomeSearch(""); // Clear the input after search
  };
  const handleInputChange = (e) => setHomeSearch(e.target.value);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!homeSearch.trim()) return;
    navigate(
      `/search?search=${encodeURIComponent(homeSearch)}&sort=${sortOrder}`
    );
    setHomeSearch("");
  };

  return (
    <form id="homeSearch" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, year or producer"
          value={homeSearch}
          onChange={handleInputChange}
          aria-label="Search input"
        />
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={toggleSortOrder}
          aria-label={`Toggle sort order, currently ${
            sortOrder === "asc" ? "ascending" : "descending"
          }`}
          title={`Ordina ${sortOrder === "asc" ? "crescente" : "decrescente"}`}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          {sortOrder === "asc" ? (
            <i className="fa-solid fa-arrow-up"></i>
          ) : (
            <i className="fa-solid fa-arrow-down"></i>
          )}
        </button>
        <button
          type="submit"
          className="btn btn-outline-light ms-2"
          aria-label="Search"
          title="Cerca"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
