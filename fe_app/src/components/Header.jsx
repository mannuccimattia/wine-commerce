import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import GlobalContext from '../contexts/globalContext';

const Header = () => {

    const { toDisable, setToDisable } = useContext(GlobalContext);

    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        const target = e.target.value;
        // Toggle disable state
        setToDisable(target === toDisable ? null : target);
        // If click on view all, edit path to /search/all  
        navigate(`/${target}`);
    }

    const handleLogoClick = () => {
        setToDisable(null); // Clear disable state when clicking logo
    }

    return (
        <nav className="navbar navbar-dark m-3" style={{ backgroundColor: '#212223' }}>
            <div className="container-fluid">
                <Link className='navbar-brand' to="/" onClick={handleLogoClick}>
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
                        id='products'
                        value="products"
                        onClick={handleClick}
                        disabled={toDisable === "products"}
                    >

                        <i className="fa-solid fa-eye me-1"></i> View All
                    </button>
                    <button
                        className='btn btn-outline-light'
                        id='cart'
                        value="cart"
                        onClick={handleClick}
                        disabled={toDisable === "cart"}
                    >
                        <i className="fa-solid fa-cart-shopping me-1"></i> Go to Cart
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;