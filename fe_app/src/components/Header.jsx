import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import GlobalContext from "../contexts/globalContext";
import SearchForm from "./SearchForm";
import { useCarrello } from "../contexts/cartContext"; // Import the cart context

const Header = () => {
  const { toDisable, setToDisable } = useContext(GlobalContext);
  const { carrello } = useCarrello(); // Access cart items from context
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    const target = e.currentTarget.value; // Fix here
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

  // Calculate total amount based on cart items
  const total = carrello.reduce((acc, item) => acc + item.qty * item.prezzo, 0);

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
              className="btn btn-outline-light position-relative"
              value="cart"
              onClick={handleClick}
              disabled={toDisable === "cart"}
            >
              <i className="fa-solid fa-cart-shopping me-1"></i>
              {carrello.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-black">
                  {carrello.reduce((acc, item) => acc + item.qty, 0)}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
              {total > 0 && <span className="ms-2">€{total.toFixed(2)}</span>}
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
