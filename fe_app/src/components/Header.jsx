import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className='navbar bg-primary mb-4'>
            <div className="container-fluid">
                <Link className='navbar-brand' to="/">Boolz</Link>
                <Link className="btn btn-light" to="/search">
                    Cerca Vino
                </Link>
            </div>
        </nav>
    );
};

export default Header