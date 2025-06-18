// import axios from 'axios'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../contexts/globalContext'
import CategoriesCard from '../components/CategoriesCard'
import HeroCarousel from '../components/HeroCarousel';
import BestSellers from '../components/BestSellers';

const Homepage = () => {
    // const [wines, setWines] = useState([]);

    const navigate = useNavigate();

    const {
        // setIsLoading, 
        homeSearch,
        setHomeSearch
    } = useContext(GlobalContext);

    // const endpoint = !homeSearch
    //     ? 'http://localhost:3000/api/wines'
    //     : `http://localhost:3000/api/wines?search=${homeSearch}`

    // const fetchWines = () => {
    //     setIsLoading(true);
    //     axios.get(endpoint, { timeout: 20000 })
    //         .then((response) => {
    //             setWines(response.data);
    //             setIsLoading(false);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    const handleHomeSearch = (e) => {
        setHomeSearch(e.target.value);
    }

    const handleHomeSearchSubmit = (e) => {
        e.preventDefault();
        // fetchWines();
        console.log(homeSearch)
        navigate("products/search");
    }

    // useEffect(() => {
    //     fetchWines();
    // }, []);

    return (
        <>
            <div className="row">
                <div className="col-12">

                    <form id="homeSearch" onSubmit={handleHomeSearchSubmit}>
                        <div className="form-group d-flex">
                            <input
                                type="text"
                                className="form-control text-white rounded-0 rounded-start"
                                data-bs-theme="dark"
                                placeholder="Search by Name"
                                value={homeSearch}
                                onChange={handleHomeSearch}
                            />
                            <button className="btn btn-outline-light rounded-0 rounded-end" type="submit">
                                <i className='fa-solid fa-magnifying-glass'></i>
                            </button>
                        </div>
                    </form>

                    {/* <input
                        type="text"
                        id='home-search'
                        placeholder="Search by name, year or producer"
                        className='form-control rounded-0 rounded-start'
                        value={homeSearch}
                        onChange={handleHomeSearch}
                    />
                    <button
                        className='btn btn-outline-light rounded-0 rounded-end'
                        onClick={handleHomeClick}
                    >
                        <i className='fa-solid fa-magnifying-glass'></i>
                    </button> */}
                </div>
            </div>
            <hr />
            <HeroCarousel />
            <div className="homepage-background">
                <CategoriesCard />
                <BestSellers />
            </div>
        </>
    );
};

export default Homepage;

