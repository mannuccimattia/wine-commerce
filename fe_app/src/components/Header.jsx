import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../contexts/globalContext";
import SearchForm from "./SearchForm";
import { useCarrello } from "../contexts/CartContext";
import CartSidebar from "./CartSidebar"; // importa CartSidebar

const Header = () => {
  const { toDisable, setToDisable } = useContext(GlobalContext);
  const { carrello } = useCarrello();
  const navigate = useNavigate();
  const location = useLocation();

  const [showSidebar, setShowSidebar] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    const target = e.currentTarget.value;
    if (target === "cart") {
      // Non navighiamo più ma apriamo sidebar
      setShowSidebar(true);
    } else {
      setToDisable(target === toDisable ? null : target);
      navigate(`/${target}`);
    }
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

  // Calcola totale carrello
  const total = carrello.reduce((acc, item) => acc + item.qty * item.prezzo, 0);
  const totalItems = carrello.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <nav
        className="navbar navbar-dark m-3"
        style={{ backgroundColor: "#212223" }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center header-mobile-stack">
          {/* Logo */}
          <div className="col-12 col-lg-3 col-xl-2">
            <Link className="navbar-brand me-0" to="/" onClick={handleLogoClick}>
              <img
                src="\imgs\wordmarks\boolze-high-resolution-wordmark.png"
                alt="Bool Wines Logo"
                height="40"
              />
            </Link>
          </div>

          {/* Searchbar */}
          <div className="col-12 col-lg-6 col-xl-8 justify-content-center">
            <SearchForm />
          </div>

          {/* Cart Section */}
          <div className="col-12 col-lg-3 col-xl-2 d-flex justify-content-end align-items-center">
            {/* Desktop - Show amount */}
            <button
              className="btn btn-outline-light position-relative"
              value="cart"
              onClick={handleClick}
              disabled={toDisable === "cart"}
            >
              <i className="fa-solid fa-cart-shopping me-1"></i>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill cart-pill">
                  {totalItems}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
              {total > 0 && <span className="ms-2">€{total.toFixed(2)}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar carrello */}
      <CartSidebar show={showSidebar} onHide={() => setShowSidebar(false)} />
    </>
  );
};

export default Header;
