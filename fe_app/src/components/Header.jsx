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
        setToDisable(target === toDisable ? null : target); // Toggle disable state
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
                        id='search'
                        value="search"
                        onClick={handleClick}
                        disabled={toDisable === "search"}
                    >

                        <i className="fa-solid fa-magnifying-glass me-1"></i> Search
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