import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="navbar navbar-dark mb-4" style={{ backgroundColor: '#212223' }}>
            <div className="container-fluid">
                <Link className='navbar-brand' to="/"><img src="\imgs\wordmarks\boolze-high-resolution-wordmark.png"
                    alt="Bool Wines Logo"
                    height="40"
                    className="me-2" />
                </Link>
                <Link className="btn" to="/search">
                    Cerca Vino
                </Link>
            </div>
        </nav>
    );
};

export default Header