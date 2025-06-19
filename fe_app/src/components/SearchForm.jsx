import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../contexts/globalContext";

const SearchForm = () => {
  const { homeSearch, setHomeSearch } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => setHomeSearch(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!homeSearch.trim()) return;
    navigate(`/search?search=${encodeURIComponent(homeSearch)}`);
    setHomeSearch("");
  };

  return (
    <form id="homeSearch" onSubmit={handleSubmit}>
      <div className="form-group d-flex">
        <input
          type="text"
          className="form-control rounded-0 rounded-start"
          placeholder="Search by name, year or producer"
          value={homeSearch}
          onChange={handleInputChange}
        />
        <button
          className="btn btn-outline-light rounded-0 rounded-end"
          type="submit"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
