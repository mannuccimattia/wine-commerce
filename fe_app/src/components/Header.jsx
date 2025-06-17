import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="navbar navbar-dark mb-4" style={{ backgroundColor: '#212223' }}>
            <div className="container-fluid">
                <Link className='navbar-brand' to="/">
                    <img
                        src="\imgs\wordmarks\boolze-high-resolution-wordmark.png"
                        alt="Bool Wines Logo"
                        height="40"
                        className="me-2"
                    />
                </Link>
                <div className="d-flex gap-3">
                    <Link className="btn btn-outline-light" to="/search">
                        Cerca Vino
                    </Link>
                    <Link className='btn btn-outline-light' to="/cart">
                        Vai al carrello
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;