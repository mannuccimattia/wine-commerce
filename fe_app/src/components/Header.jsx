import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../contexts/globalContext";
import SearchForm from "./SearchForm";
import { useCarrello } from "../contexts/cartContext";
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
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link className="navbar-brand" to="/" onClick={handleLogoClick}>
            <img
              src="\imgs\wordmarks\boolze-high-resolution-wordmark.png"
              alt="Bool Wines Logo"
              height="40"
              className="me-2"
            />
          </Link>

          {/* Cart Section */}
          <div className="d-flex align-items-center">
            {/* Desktop - Show amount */}
            <button
              className="btn btn-outline-light position-relative d-none d-md-inline-block"
              value="cart"
              onClick={handleClick}
              disabled={toDisable === "cart"}
            >
              <i className="fa-solid fa-cart-shopping me-1"></i>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-black">
                  {totalItems}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
              {total > 0 && <span className="ms-2">€{total.toFixed(2)}</span>}
            </button>

            {/* Mobile - Icon only */}
            <button
              className="btn btn-outline-light position-relative d-md-none p-2"
              value="cart"
              onClick={handleClick}
              disabled={toDisable === "cart"}
              style={{ minWidth: "44px", minHeight: "44px" }}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              {totalItems > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-black"
                  style={{ fontSize: "0.75rem" }}
                >
                  {totalItems}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="col-12">
        <SearchForm />
      </div>

      {/* Sidebar carrello */}
      <CartSidebar show={showSidebar} onHide={() => setShowSidebar(false)} />
    </>
  );
};

export default Header;
