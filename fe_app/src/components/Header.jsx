import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import GlobalContext from "../contexts/globalContext";
import SearchForm from "./SearchForm";

const Header = () => {
  const { toDisable, setToDisable } = useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    const target = e.currentTarget.value; // Fix qui
    setToDisable(target === toDisable ? null : target);
    navigate(`/${target}`);
  };

  const handleLogoClick = () => {
    setToDisable(null);
  };

  useEffect(() => {
    if (
      !location.pathname.startsWith(`/products`) &&
      !location.pathname.startsWith("/cart")
    ) {
      setToDisable(null);
    }
  }, [location.pathname]);

  return (
    <>
      <nav
        className="navbar navbar-dark m-3"
        style={{ backgroundColor: "#212223" }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={handleLogoClick}>
            <img
              src="\imgs\wordmarks\boolze-high-resolution-wordmark.png"
              alt="Bool Wines Logo"
              height="40"
              className="me-2"
            />
          </Link>
          <div className="d-flex gap-3">
            <button
              className="btn btn-outline-light"
              value="products"
              onClick={handleClick}
              disabled={toDisable === "products"}
            >
              <i className="fa-solid fa-eye me-1"></i> View All
            </button>
            <button
              className="btn btn-outline-light"
              value="cart"
              onClick={handleClick}
              disabled={toDisable === "cart"}
            >
              <i className="fa-solid fa-cart-shopping me-1"></i> Go to Cart
            </button>
          </div>
        </div>
      </nav>

      <div className="col-12">
        <SearchForm />
      </div>
    </>
  );
};

export default Header;
